<?php
// 2) Для второго свособа (JSON)
//Получение JSON данных на php 
$_POST = json_decode(file_get_contents("php://input"), true); 
echo var_dump($_POST);
//команда echo позволяет увидеть те данные которые приходят с клиента
