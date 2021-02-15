#!/bin/bash
i="0"
forever start src/actualizarC.js & 
forever start src/actualizarP.js &
forever start src/actualizarU.js &
forever start src/allPadrones.js &
forever start src/comprobarU.js &
forever start src/folios.js &
forever start src/genFolio.js &
forever start src/getAvatar.js &
forever start src/getInfoReg.js &
forever start src/informeM.js &
forever start src/obtenerOF.js &
forever start src/obtenerZ.js &
forever start src/padrones.js &
forever start src/predial.js &
forever start src/registrarC.js &
forever start src/registrarF.js &
#forever start src/registrarE.js &
#forever start src/registrarE2.js &
forever start src/registrarO.js &
forever start src/registrarO2.js &
forever start src/registrarO3.js &
forever start src/registrarO4.js &
forever start src/registrarO5.js &
forever start src/registrarU.js &
forever start src/saveDataL.js &
forever start src/checkPorts.js &
forever start src/renderEscritura.js
while [ $i -lt 128 ]
do
forever start "src/upPdf/registrarE$i.js"
i=$[$i+1]
#portC=$[$portC+1]
done