!#/bin/sh

yarn install
yarn run rebuild

cd /usr/src
git clone https://git.kernel.org/pub/scm/fs/squashfs/squashfs-tools.git
cd squashfs-tools/squashfs-tools

sudo make install

mkdir -p  ~/.cache/electron-builder/appimage/appimage-9.1.0/linux-arm
cd ~/.cache/electron-builder/appimage/appimage-9.1.0/linux-arm
ln -s /usr/local/bin/mksquashfs mksquashfs

yarn run electron:linux:armv7l
