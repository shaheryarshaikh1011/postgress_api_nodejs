const express = require("express");
const app = express();



const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect();

app.use(express.json()) //req.body


//routes//


app.get("/api/dept",async (req,res)=>{
    try{
        const alldept = await pool.query("SELECT * FROM dept");
        res.json(alldept.rows);
    }
    catch(err)
    {
        console.log(err.message);
    }
})

app.get("/api/emp",async (req,res)=>{
    try{
        const allemp = await pool.query("SELECT * FROM emp");
        res.json(allemp.rows);
    }
    catch(err)
    {
        console.log(err.message);
    }
})

app.get("/api/alldata/:id",async(req,res)=>
{
    try{
        const {id} = req.params;
        const alldata = await pool.query("SELECT emp_id, emp_name, emp_gender, emp_location, emp_doj, dept_name,dept_location FROM dept INNER JOIN emp ON dept_id = emp_deptid WHERE emp_id=$1",[id]);
        res.json(alldata.rows[0]);
    }
    catch(err)
    {
        console.error(err.message);
    }
})

// create a dept data
app.post("/api/dept", async(req,res)=>{    
    // Grab data from http request
    const data = {
        dept_id: req.body.dept_id,
        dept_name: req.body.dept_name,
        dept_location : req.body.dept_location
    };

    const values = [
        data.dept_id,
        data.dept_name,
        data.dept_location
    ];
    
    try{
         
        
         const newdept = await pool.query("INSERT INTO dept (dept_id,dept_name,dept_location) VALUES ($1,$2,$3) RETURNING *",
         values
         );
         

         res.json(newdept.rows[0]);
    }
    catch(err)
    {
        console.log(err.message);
    }
})

// create emp data
app.post("/api/emp", async(req,res)=>{    
    // Grab data from http request
    const data = {
        emp_id: req.body.emp_id,
        emp_age: req.body.emp_age,
        emp_name: req.body.emp_name,
        emp_gender: req.body.emp_gender,
        emp_deptid: req.body.emp_deptid,
        emp_location:req.body.emp_location,
        emp_doj:Date.now(),

    };
    
    const values = [
        data.emp_id, 
        data.emp_age, 
        data.emp_name, 
        data.emp_gender, 
        data.emp_deptid, 
        data.emp_location,
        data.emp_doj
    ];
    
    try{
         
         const newemp = await pool.query("INSERT INTO emp (emp_id,emp_age,emp_name,emp_gender,emp_deptid,emp_location,emp_doj) VALUES ($1,$2,$3,$4,$5,$6,(to_timestamp($7 / 1000.0))) RETURNING *",
         values
         );
         
         

         res.json(newemp.rows[0]);
         
    }
    catch(err)
    {
        console.log(err.message);
    }
})



app.listen(3000||process.env.PORT,()=>{
    console.log("Server is running on port 3000");
})