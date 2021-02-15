import React from "react";
import cookie from "react-cookies";
import GridItem from "components/Grid/GridItem.js"
import GridContainer from "components/Grid/GridContainer.js"
import CustomInput from "components/CustomInput/CustomInput.js"
import Button from "components/CustomButtons/Button.js"
import Card from "components/Card/Card.js"
import CardHeader from "components/Card/CardHeader.js"
import CardBody from "components/Card/CardBody.js"
import CardFooter from "components/Card/CardFooter.js"
import Snackbar from "components/Snackbar/Snackbar.js"
import { makeStyles } from "@material-ui/core/styles";
import WN from "@material-ui/icons/Warning"
import E from "@material-ui/icons/Error"
import CheckCircle from "@material-ui/icons/CheckCircle"


const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

export default function Acceso() {
  
  const [tr, setTR] = React.useState(false);
 // const [trC, setTRC] = React.useState(false);
  const [trP, setTRP] = React.useState(false);
  const [trA, setTRA] = React.useState(false);
  const [trE, setTRE] = React.useState(false);
  const [wMessage, setWMessage] = React.useState("");
  const [eMessage, setEMessage] = React.useState("");
  //const [sMessage, setSMessage] = React.useState("");
  const classes = useStyles();
  
  const showNotification = place => {
    switch (place) {
      case "tr":
        if (!tr) {
          setWMessage("Advertencia, favor de rellenar los datos requeridos")
          setTR(true);
          setTimeout(function () {
            setTR(false);
          }, 6000);
        }
        break;
      case "trP":
      if (!trP) {
        
        setTRP(true);
        setTimeout(function () {
          setTRP(false);
        }, 6000);
      }
      break;
      case "trA":
      if (!trP) {
        setTRA(true);
        setTimeout(function () {
          setTRA(false);
          document.location.href = '.'
          
        }, 3000);
      }
      break;
      case "trE":
      if (!trE) {
        setTRE(true);
        setTimeout(function () {
          setTRE(false);
        }, 6000);
      }
      break;
      default:
        break;
    }
  };
  
  const saveCookies = (idUsuario, nombre, correo, edad, idRol, pass) => {
        cookie.save("idUsuario", idUsuario, { path: "/", domain: 'https://catastro.sys.chilapadealvarez.mx' });
        cookie.save("nombre", nombre, { path: "/", domain: 'https://catastro.sys.chilapadealvarez.mx' });
        cookie.save("correo", correo, { path: "/", domain: 'https://catastro.sys.chilapadealvarez.mx' });
        cookie.save("edad", edad, { path: "/", domain: 'https://catastro.sys.chilapadealvarez.mx' });
        cookie.save("idRol", idRol, { path: "/", domain: 'https://catastro.sys.chilapadealvarez.mx' });
        cookie.save("pass", pass, { path: "/", domain: 'https://catastro.sys.chilapadealvarez.mx' });
  }

  const validarDatos = () => {
    const CVE_ID = document.getElementById('idUsuario')
    const pass = document.getElementById('pass')
    if (CVE_ID.value === '') {
      showNotification("tr")
      CVE_ID.focus()
      return false
    }

    if (pass.value === '') {
      showNotification("tr")
      pass.focus()
      return false
    }
    import("./comprobarU").then(({comprobarU})=>{
      comprobarU(CVE_ID.value, pass.value, saveCookies, setEMessage,showNotification)
    })
  }

const accesoKey = (e) =>{
  if (e.which === 13) {
    validarDatos();
  }
}

  return (
    <div>
      <GridContainer>
        <Snackbar
          place="tr"
          color="warning"
          icon={WN}
          message={wMessage}
          open={tr}
          closeNotification={() => setTR(false)}
          close
        />
        <Snackbar
          place="tr"
          color="danger"
          icon={E}
          message={eMessage}
          open={trP}
          closeNotification={() => setTRP(false)}
          close
        />
        <Snackbar
          place="tr"
          color="danger"
          icon={E}
          message={eMessage}
          open={trE}
          closeNotification={() => setTRE(false)}
          close
        />
        <Snackbar
          place="tr"
          color="success"
          icon={CheckCircle}
          message="Empleado registrado con éxito"
          open={trA}
          closeNotification={() => setTRA(false)}
          close
        />
        <GridItem xs={8} sm={8} md={4}></GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Acceder al sistema</h4>
              <p className={classes.cardCategoryWhite}>
                Favor de ingresar su número de empleado y contraseña
              </p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={4} sm={4} md={3} />
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="ID de empleado"
                    id="idUsuario"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "number",
                      onKeyUp: accesoKey
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={4} sm={4} md={3} />
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Contraseña"
                    id="pass"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "password",
                      onKeyUp: accesoKey
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button
                id="regB"
                color="success"
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center"
                }}
                onClick={validarDatos}
              >
                Entrar
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

