ELECTRIC FOOSBALL
=================

# Arduino Control Pinouts

2 -> IR Detector 0 Vout
3 -> IR Detector 1 Vout
5 -> IR Emitter 0 Vin
8 -> Button 0 Vin
9 -> Button 1 Vin
11 -> Button 2 Vin
12 -> Button 3 Vin


Setup Instructions
==================

* Start with latest Raspbian Wheezy
* Log in

* Run rpi-update
* Run raspi-config
	- force analog audio
	- set hostname to foosball
	- adjust GPU memory split to 16
	- enable SSH

* Install required software
	- sudo apt-get install avahi-daemon nginx git

* Install required libraries
	- ?

* Install Node
cd /tmp
wget http://nodejs.org/dist/v0.10.2/node-v0.10.2-linux-arm-pi.tar.gz
tar -xvzf node-v0.10.2-linux-arm-pi.tar.gz
sudo mv node-v0.10.2-linux-arm-pi /opt/node
sudo ln -s  /opt/node/bin/node /usr/bin/node
sudo ln -s  /opt/node/bin/npm /usr/bin/npm

* Checkout Git repo
cd /opt
sudo mkdir foosball
sudo chown pi:pi foosball
git clone https://github.com/rayui/electricfoosball.git foosball
cd foosball

* Update npm and install deps
** caution - npm install doesn't work with package.json in 10.2
** you may have to install them manually
npm update
npm install 

