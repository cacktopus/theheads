for i in -1 0 1; do
	echo "$i "
	grpcurl -plaintext -d "{\"theta\": $i}" 10.1.0.108:8080 heads.head.rotation > /dev/null
	sleep 1
	grpcurl -plaintext 10.1.0.108:8080 heads.head.read_magnet_sensor | jq .b
done
grpcurl -plaintext -d "{\"theta\": 0}" 10.1.0.108:8080 heads.head.rotation > /dev/null
