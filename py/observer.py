class Observer:
    def __init__(self):
        self.__observers = []

    def register_observer(self, observer):
        self.__observers.append(observer)

    def notify_observers(self, subject, **kwargs):
        for observer in self.__observers:
            observer.notify(subject, **kwargs)
