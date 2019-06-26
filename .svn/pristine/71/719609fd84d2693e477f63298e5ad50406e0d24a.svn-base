var myNodes = [];
var myLinks = [];


self.onmessage = function(e) {
//self.postMessage("here");
		
	var nodeIdCounter = 0;
	var searchResult = e.data.searchResult;
	var currentNetwork = e.data.currentNetwork;

	// get nodes from subject
	for (var i = 0; i < searchResult.length; i++) {

		var node1 = { id:" ", anchor:false, sColor:"black", visible:true };

		node1.network = currentNetwork;
		node1.id = "" + currentNetwork + "." + nodeIdCounter;
		node1.symbol = clean(searchResult[i][5], "|||");
		node1.name = clean(searchResult[i][6], "|||");
		node1.semtype = clean(searchResult[i][7], "|||");
		node1.novel = searchResult[i][8];
		node1.x = 200;
		node1.y = 200;

		//if node1.symbol not in network, push
		if (findNode(node1.symbol, currentNetwork) == -1){

			myNodes.push(node1);
			nodeIdCounter++;

		}
		
		var node2 = { id:" ", anchor:false, sColor:"black", visible:true };

		node2.network = currentNetwork;
		node2.id = "" + currentNetwork + "." + nodeIdCounter + ".5";
		node2.symbol = clean(searchResult[i][9], "|||");
		node2.name =  clean(searchResult[i][10], "|||");
		node2.semtype = clean(searchResult[i][11], "|||");
		node2.novel = searchResult[i][12];
		node2.x = 200;
		node2.y = 200;

		//if node2.symbol not in network, push
		if (findNode(node2.symbol, currentNetwork) == -1){
			myNodes.push(node2);
			nodeIdCounter++;
		}
		
		
		//get links

		var link1 = { source:" ", target:" ", sColor:"black", 
				predicate:[{label:" ", visible:true, sentence:[{PMID:"", SID:"", sNumber:"", abti:"", text:""}] }] };

		link1.source = myNodes[findNode(clean(searchResult[i][5], "|||"), 
										currentNetwork)];
		link1.target = myNodes[findNode(clean(searchResult[i][9], "|||"), 
										currentNetwork)];
		link1.predicate[0].label = searchResult[i][4];

		link1.predicate[0].sentence[0].PMID = searchResult[i][3];
		link1.predicate[0].sentence[0].SID = searchResult[i][1];
	
		var linkFound = findLink(link1, currentNetwork);

		if (linkFound != -1) { // link exists

			var predicateFound = findPredicate(link1.predicate[0], linkFound, currentNetwork );

			if (predicateFound != -1 ) { // predicate exists

				myLinks[linkFound].predicate[predicateFound].sentence.push(link1.predicate[0].sentence[0]);
			}

			else { // predicate doesn't exist

				myLinks[linkFound].predicate.push(link1.predicate[0]);
			}
		}


		else { myLinks.push(link1); }


		var progress3 = {};
		var percentLoaded = Math.round((i / searchResult.length) * 100);
		// Increase the progress bar length.
		if (percentLoaded < 100) {
			progress3.name = "progress3";
			progress3.width = percentLoaded + '%';
			progress3.textContent = percentLoaded + '%';
			self.postMessage(progress3);
		}
	
	} // for each searchResult 

	var myJSON = {};
	myJSON.nodes = myNodes;
	myJSON.links = myLinks;
	self.postMessage(myJSON);

	function findNode(symb) {
		for (var i = 0; i < myNodes.length; i++) {

			if (myNodes[i].symbol == symb) {
				return i;
			}
		}

		return -1;
	}

	function findLink(link1) {
		for (var i = 0; i < myLinks.length; i++) {
			if (myLinks[i].source == link1.source && myLinks[i].target == link1.target) {

				return i;
			}
		}

		return -1;
	}

	function findPredicate(predicate1, linkIndex) {

		for (var j = 0; j < myLinks[linkIndex].predicate.length; j++ ) {

			if (myLinks[linkIndex].predicate[j].label == predicate1.label) {

				return j;
			}
		}


		return -1;
	}

	function clean(text, stop){
		var found = text.indexOf(stop);
		if (found != -1) return text.substr(0,found); else return text;
	}

};

