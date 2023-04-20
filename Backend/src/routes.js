import dotenv from 'dotenv';
dotenv.config();

//Importa todos os componentes
import { Router } from "express"
import mysql2 from "mysql2"
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import jsonwebtoken from "jsonwebtoken"

//Cria uma variavel com o express
const routes = Router()

const { createConnection } = mysql2
const { hash, compare } = bcrypt
const { sign } = jsonwebtoken
const { json, urlencoded } = bodyParser

routes.use(json())
routes.use(urlencoded({ extended: true }));

//Conecta com o banco de dados
const connection = createConnection(process.env.DATABASE_URL)

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados' + err.stack);
        return
    }
    console.log('Conexão com banco realizada!');
})

routes.post('/login', (req, res) => {
    if (req.body.action === 'signup') {
        const { email, password, name, surname } = req.body
        //Verificação de duplicidade
        connection.query('SELECT * FROM user WHERE email = ?', [email], (err, rows) => {
            if (err) throw err
            if (rows.length > 0) {
                console.log(`O email ${email} já esta em uso.`)
                res.status(409).send(`ò email ${email} já esta em uso.`)
                return
            }
            hash(password, 10, (err, hash) => {
                if (err) throw err
                connection.query('INSERT INTO user (email, password, name, surname) VALUES (?, ?, ?)', [email, hash, name, surname], (err, result) => {
                    if (err) throw err
                    res.send(`Registro Criado com sucesso! ID: ${result.insertId}`)
                })
            })
        })
    } else if ( req.body.action === 'login'){

    }else {
        res.status(400).send('Ação Inválida')
    }
})

export default routes