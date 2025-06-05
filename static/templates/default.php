<?php
	// Helper to read from STDIN
    $input = stream_get_contents(STDIN);
    $lines = explode("\n", trim($input));

    echo "Hello World!";
?>