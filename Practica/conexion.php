<?php

    if(isset($_GET["tipoConsulta"])){
        $numeroConsulta = $_GET["tipoConsulta"];
        switch($numeroConsulta){            
            case "1":
                //En Insercion de dato
                if((isset($_GET["idDefinitivo"]))&&(isset($_GET["nombreDefinitivo"]))){
                    if((is_numeric($_GET["idDefinitivo"]))&&(!empty($_GET["nombreDefinitivo"]))){
                        hazElInsertGuarro($_GET["idDefinitivo"],$_GET["nombreDefinitivo"]);
                        $_GET["tipoConsulta"]="";
                        $_GET["idDefinitivo"]="";
                        $_GET["nombreDefinitivo"]="";
                    }else{
                        erroresPhp("03");
                    }
                }else{
                    erroresPhp("03");
                }
                break;
            case "2":
                //En proceso de Select                    
                    elSelectoDefinitivo();
                    $_GET["tipoConsulta"]="";
                break;
            case "3":
                //En proceso Borrar
                if(isset($_GET["idDefinitivo"])){
                    if(is_numeric($_GET["idDefinitivo"])){
                       eliminenEseMal($_GET["idDefinitivo"]);
                       $_GET["tipoConsulta"]="";
                       $_GET["idDefinitivo"]="";
                    }else{
                        erroresPhp("03");
                    }
                }else{
                    erroresPhp("03");
                }
                break;
            default:
                erroresPhp("01");
                break;
        }
    }else{
        erroresPhp("02");
    }
    function erroresPhp ($codigoError){ ?>
        <div class="col-12 p-3  bg-danger text-white text-center">
        <?php switch ($codigoError){ 
             case "01":             
                echo "El tipo de consulta no es compatible";
                break;
           case "02":  
                echo "No hay tipo de consulta";
                break; 
             case "03": 
                echo "No se ha seleccionado correctamente los datos";
                break;
             case "04": 
                echo "La conexión con la base de datos ha fallado";
                break;
            case "05":
                echo "Error en la insercción en Base de datos, sentencia";
                break;
            case "06":
                echo "Error este registro ya se ha guardado";
                break;
            case "07":
                echo "No hay Registros guardados";
                break;
            case "08":
                echo "Ese registro no existe";
                break;
            default:
                echo "Error no identificado";
                break;
        }?> 
        
        </div>
        <?php
    }
    function funcionaCodigo ($codigoBien){ ?>
        <div class="col-12 p-3  bg-success text-white text-center">
        <?php switch ($codigoBien){ 
           case "01":          
                   echo "Se realizó la inserccion guardada correctamente";
                break;
            case "02": 
                echo "Se elimino el registro correctamente";
                break;
        } ?>         
        </div>
    <?php }
    function hazElInsertGuarro($idCodigo, $nombreCodigo){    
        $login = "root";
        $hostNombre = "localhost";
        $contrasenia = "";  
        $conexion = mysqli_connect($hostNombre,$login,$contrasenia,'privadabase');
        if(!$conexion) {
            erroresPhp("04");
        } else {            
            $consulta = "SELECT idSeleccion FROM privadabase.seleccion where numeroSeleccion='".$idCodigo."';";
            $resultado1 = mysqli_query($conexion, $consulta);
            if(mysqli_num_rows($resultado1)==0){
                $consulta = "INSERT INTO privadabase.seleccion (numeroSeleccion, nombreSeleccion) VALUES (".$idCodigo.",'".$nombreCodigo."' );";
                $resultado2 = mysqli_query($conexion, $consulta);
                if($resultado2==true){                
                    funcionaCodigo("01");
                }else{
                    erroresPhp("05");
                }
            }else{  
                erroresPhp("06");
            }            
        }
    }
    function elSelectoDefinitivo(){   
        $login = "root";
        $hostNombre = "localhost";
        $contrasenia = "";  
        $conexion = mysqli_connect($hostNombre,$login,$contrasenia,'privadabase');
        if(!$conexion) {
            erroresPhp("04");
        } else {
            $consulta = "SELECT * FROM privadabase.seleccion;";
            $resultado = mysqli_query($conexion, $consulta);
            if(mysqli_num_rows($resultado)!=0){        
                $arrayIdSeleccionado=[];
                $arrayNombreSeleccionado=[];            
                while($row = mysqli_fetch_assoc($resultado)){
                    $arrayIdSeleccionado[] = $row["numeroSeleccion"];
                    $arrayNombreSeleccionado[] = $row["nombreSeleccion"];
                }
                devuelvanEsaTablona($arrayIdSeleccionado,$arrayNombreSeleccionado);
            }else{
                erroresPhp("07");
            }
        }
    }
    function devuelvanEsaTablona($arrayIdSeleccionado,$arrayNombreSeleccionado){
        ?> 
        <div class="col-12"> 
            <table class="table text-center"> <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Boton</th>
                </tr>
            </thead> <tbody>
        <?php
        for($a=0;$a<sizeof($arrayIdSeleccionado);$a++){
            $numeroEspecifico = $arrayIdSeleccionado[$a];
            $nombreEspecifico = $arrayNombreSeleccionado[$a];
        ?>
            <tr>
                <td id="numeroIdPokemonGuardado<?php echo $a+1?>"> <?php echo $numeroEspecifico ?></td>
                <td id="nombrePokemonGuardado<?php echo $a+1?>"> <?php echo $nombreEspecifico ?> </td>
                <td> 
                    <a class="btn btn-success botonBorrar" data-code="<?php echo $a+1?>">Borrar</a> 
                </td>
            </tr>
        <?php } ?>
        </tbody></table></div>
        <?php
    }
    function eliminenEseMal($idPokemonSeleccionado){
        $login = "root";
        $hostNombre = "localhost";
        $contrasenia = "";  
        $conexion = mysqli_connect($hostNombre,$login,$contrasenia,'privadabase');
        if(!$conexion) {
            erroresPhp("04");
        } else {
            $consulta = "DELETE FROM privadabase.seleccion WHERE (numeroSeleccion = ".$idPokemonSeleccionado." AND idSeleccion <> 0);";
            $resultado = mysqli_query($conexion, $consulta);
            if($resultado){
                funcionaCodigo("02");
            }else{
                erroresPhp("08");
            }
        }
    }
?>