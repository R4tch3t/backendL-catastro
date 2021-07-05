echo on
echo Inicializando puertos...
git pull
start cmd /c forever stopall
start /min cmd /c forever start -c node .\src
exit