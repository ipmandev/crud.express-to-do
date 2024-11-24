/*const express = require ("express");
const cors = require ("cors");
const { text } = require("body-parser");
const bodyParser = require ("body-parser");
const mysql = require ("mysql2/promise");

const app = express();
const port = 5008;

app.use(cors());
app.use(bodyParser.json());

//conexión

const pool = mysql.createPool({
host:"localhost",
user: "root",
password:"",
database:"agenda"
})

//consultar base de datos
//500 en un servidor significa que no hubo conexión

app.get ("/todos",async(req,res)=>{
    try{
        const [rows]=await pool.query ("SELECT * FROM todo");
        res.json(rows);

    }catch (error){
        console.log(error)
        res.status (500).send("error al ontener las tareas")    
    }

  
})

//agregar datos a la BD

app.post("/todos", async(req,res)=>{
    const {text}=req.body;
    try{
        const [result]= await pool.query ("INSERT INTO todo (text, completed) VALUES(?,?)",[text,false]);
        res.json({id:result.insertId});
    }catch (error) {
        res.status (500).send("error al agregar tarea");
    }

});


//actualizar y endpoint
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    try {
        if (text !== undefined) {
            await pool.query("UPDATE todo SET text = ? WHERE id = ?", [text, id]);
        }
        if (completed !== undefined) {
            await pool.query("UPDATE todo SET completed = ? WHERE id = ?", [completed, id]);
        }

        res.json({ message: "Tarea actualizada correctamente" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error al actualizar la tarea");
    }
});


//eliminar datos de  la tabla

app.delete ("/todos/:id", async(req,res)=>{

    const {id}= req.params;

    try {
        await pool.query ("DELETE FROM todo WHERE ID =?",[id])
        res.json ({message:"Tarea eliminada"})
    }catch (error){
        console.log ("error",error)
        res.status (500).send ("error al eliminar la tarea!")
    
    }
}) ; 

app.listen (port,()=>{
    console.log (`servidor ejecutándose en el puerto ${port}`)
});


*/

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const port = 5008;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "$3088917Arq",
    database: "datos_cali"
});

// Probar conexión
pool.getConnection()
    .then(() => console.log("Conexión exitosa a la base de datos"))
    .catch((err) => console.error("Error al conectar con la base de datos:", err));

// Consultar base de datos
app.get("/todos", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM todo");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener las tareas");
    }
});

// Agregar datos a la base de datos
app.post("/todos", async (req, res) => {
    const { text } = req.body;

    // Validación de datos
    if (!text) {
        return res.status(400).json({ error: "El campo 'text' es obligatorio" });
    }

    try {
        // Inserta datos en la base de datos
        const [result] = await pool.query(
            "INSERT INTO todo (tarea, completed) VALUES (?, ?)",[text, false]
        );

        // Devuelve el ID del nuevo registro
        res.json({ id: result.insertId, message: "Tarea creada exitosamente" });
    } catch (error) {
        console.error("Error al agregar tarea:", error);
        res.status(500).send("Error al agregar tarea");
    }
});


// Actualizar datos
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;

    try {
        if (text !== undefined) {
            await pool.query("UPDATE todo SET tarea = ? WHERE id = ?", [text, id]);
        }
        if (completed !== undefined) {
            await pool.query("UPDATE todo SET completed = ? WHERE id = ?", [completed, id]);
        }

        res.json({ message: "Tarea actualizada correctamente" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error al actualizar la tarea");
    }
});

// Eliminar datos
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM todo WHERE id = ?", [id]);
        res.json({ message: "Tarea eliminada" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error al eliminar la tarea");
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
