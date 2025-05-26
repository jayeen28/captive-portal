sudo iptables -F
sudo iptables -t nat -F
sudo iptables -P FORWARD DROP

echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Allow DNS
sudo iptables -A INPUT -p udp --dport 53 -j ACCEPT
sudo iptables -A FORWARD -p udp --dport 53 -j ACCEPT

# Redirect HTTP (port 80) to Node.js server
sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j DNAT --to-destination 192.168.4.1:8080

# Masquerade internet traffic
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Allow response traffic
sudo iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

