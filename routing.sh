
sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination 10.42.0.1:8080
sudo iptables -t nat -A POSTROUTING -o wlan0 -j MASQUERADE