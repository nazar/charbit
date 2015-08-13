# !/usr/bin/env bash

# install dependencies
sudo apt-get update
sudo apt-get install -y git-core curl build-essential

# install node via nvm -  https://github.com/creationix/nvm
echo "Installing nvm..."
curl https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | bash

echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.profile
source /home/vagrant/.profile

nvm install 0.10.40
nvm alias default 0.10.40

npm install -g https://github.com/nazar/hexo/archive/2.8.3.1.tar.gz