startPath=$(pwd)
scriptPath=$(realpath $(dirname "${BASH_SOURCE[0]}"))

cd $scriptPath

. create-node-alias.sh
nodebox-general-data npm install
nodebox-general-data npm run dev

cd $startPath