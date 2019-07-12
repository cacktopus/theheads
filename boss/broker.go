package main

// https://stackoverflow.com/questions/36417199/how-to-broadcast-message-using-channel

type Message interface{}

type Broker struct {
	stopCh    chan struct{}
	publishCh chan Message
	subCh     chan chan Message
	unsubCh   chan chan Message
}

func NewBroker() *Broker {
	return &Broker{
		stopCh:    make(chan struct{}),
		publishCh: make(chan Message, 1),
		subCh:     make(chan chan Message, 1),
		unsubCh:   make(chan chan Message, 1),
	}
}

func (b *Broker) Start() {
	subs := map[chan Message]struct{}{}
	for {
		select {
		case <-b.stopCh:
			return
		case msgCh := <-b.subCh:
			subs[msgCh] = struct{}{}
		case msgCh := <-b.unsubCh:
			delete(subs, msgCh)
		case msg := <-b.publishCh:
			for msgCh := range subs {
				// msgCh is buffered, use non-blocking send to protect the broker:
				select {
				case msgCh <- msg:
				default:
				}
			}
		}
	}
}

func (b *Broker) Stop() {
	close(b.stopCh)
}

func (b *Broker) Subscribe() chan Message {
	msgCh := make(chan Message, 5)
	b.subCh <- msgCh
	return msgCh
}

func (b *Broker) Unsubscribe(msgCh chan Message) {
	b.unsubCh <- msgCh
}

func (b *Broker) Publish(msg Message) {
	b.publishCh <- msg
}
