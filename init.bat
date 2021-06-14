echo on
echo Inicializando puertos...
echo off
git pull
start cmd /c forever stopall
start /min cmd /c forever start -c node .\src