<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------
  $host = 'skr3:3306';
  $user = 'semmeduser';
  $pass = "semmeduser";
  $databaseName = "semmedVER24";
  $query = 'select * from SENTENCE where PMID in ('.$_GET['PMIDs'].') order by PMID, TYPE desc, NUMBER';

  //--------------------------------------------------------------------------
  // 1) Connect to mysql database
  //--------------------------------------------------------------------------
  include 'DB.php';
  $con = mysql_connect($host,$user,$pass);
  $dbs = mysql_select_db($databaseName, $con);

  //--------------------------------------------------------------------------
  // 2) Query database for data
  //--------------------------------------------------------------------------
  $result = mysql_query($query); //query

  if (!$result) {
    $message  = 'Invalid query: ' . mysql_error() . "\n";
    $message .= 'Whole query: ' . $query;
    die($message);
  }
  //--------------------------------------------------------------------------
  // 3) echo result as json 
  //--------------------------------------------------------------------------
  $data = array(); 
  while ($row = mysql_fetch_row($result)){
	$data[] = $row;
  }
  echo json_encode($data);
?>
