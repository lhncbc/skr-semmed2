<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------
  $host = 'skr3:3306';
  $user = 'semmeduser';
  $pass = "semmeduser";
  $databaseName = "semmedVER24";
  $query = "select s1.PMID, s1.SENTENCE title from SENTENCE s1 where s1.TYPE = 'ti' and s1.NUMBER = 1 and s1.PMID in (".$_GET["PMIDs"].") order by PMID, SENTENCE_ID;";

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
