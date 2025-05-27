#!/bin/bash

# Define variables for interfaces
WIRELESS_IFACE="wlan0"
WIRED_IFACE="eth0"

# Unblock WiFi
sudo rfkill unblock wifi

# Reset and assign IP to wireless interface
sudo ip addr flush dev "$WIRELESS_IFACE"
sudo ip addr add 192.168.4.1/24 dev "$WIRELESS_IFACE"
sudo ip link set "$WIRELESS_IFACE" up

# Clear existing iptables rules
sudo iptables -F
sudo iptables -t nat -F
sudo iptables -P FORWARD DROP

# Enable IP forwarding
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# Allow DNS
sudo iptables -A INPUT -p udp --dport 53 -j ACCEPT
sudo iptables -A FORWARD -p udp --dport 53 -j ACCEPT

# Redirect HTTP (port 80) to Node.js server on wireless interface
sudo iptables -t nat -A PREROUTING -i "$WIRELESS_IFACE" -p tcp --dport 80 -j DNAT --to-destination 192.168.4.1:8080

# Masquerade internet traffic through wired interface
sudo iptables -t nat -A POSTROUTING -o "$WIRED_IFACE" -j MASQUERADE

# Allow response traffic
sudo iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT

# Restart network services
sudo systemctl restart dnsmasq
sudo systemctl restart hostapd