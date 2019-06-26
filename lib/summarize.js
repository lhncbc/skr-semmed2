function fillSummarySelectors(){
	
	fillNetworkSelector();
	var schemaSelector = document.getElementById("networkSelector");
	if (schemaSelector.hasChildNodes() == false) fillSchemaSelector();
	fillSeedSelector(getSelectedNetwork());
    
}
function fillNetworkSelector() {

	var netList = [];

	// Get list of predicates in SVG1
	for (var i = 0; i < networks.length; i++) {
	
		netList.push({id:networks[i].id, searchTerms:networks[i].searchTerms, fileName:networks[i].fileName});
		
	}

	// Unique and sort predList
	//var networkList = netList.sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0});
	
	var networkList = netList.sort(function(a, b) { return d3.ascending(a.id, b.id); });

	// remove all previous network options
	var selector = document.getElementById("networkSelector");
	while (selector.hasChildNodes()) { 	
	    selector.removeChild(selector.lastChild);
	}
	
	networkList.forEach(function (d, i){

		if (networkInSVG1(d.id)){

		    var option = document.createElement('option');
			option.value = d.id;
			option.innerHTML = "" + (d.id+1) + " (" + d.searchTerms + " " + d.fileName + ")";
			selector.appendChild(option);
		}
		
	});

	selector.onchange = function () { setSummarySelection(); fillSeedSelector(getSelectedNetwork()); };
}

function networkInSVG1(netID){
	
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].network == netID) return true;
	}
	return false;
}

function fillSchemaSelector() {

	var selector = document.getElementById("schemaSelector");
	while (selector.hasChildNodes()) { 	// remove all previous options
	    selector.removeChild(selector.lastChild);
	}

	summarizationSchema.forEach(function (d, i){

	    var option = document.createElement('option');
		option.value = i;
		option.innerHTML = d.display;
		selector.appendChild(option);
	});
	
	selector.onchange = function () { fillSeedSelector(getSelectedNetwork()); setSummarySelection();};
}

function getSelectedSchema() {
	
	var selector = document.getElementById('schemaSelector');
	var index = selector.value;
	var schema = summarizationSchema[index]; 	 

	return schema;
}

function fillSeedSelector(network) {


	/*
	 * If summarySelection has never been run selection.network will be undefined. This means there is no prior 
	 * value in the seedSelector. Put in a temp seed and run summarySelection it because selection.summarization is 
	 * required for findRelevanceRule();
	*/
	
	setSummarySelection();
		
	setEdgeCounts(network.id);
	var nodeList1 = network.nodes.sort(function(a, b) { return d3.descending(a.edgeCount, b.edgeCount); });
	var nodeList = nodeList1.filter(function(a) {return a.edgeCount > 0;});
	var selector = document.getElementById("seedSelector");
	
	while (selector.hasChildNodes()) { 	// remove all previous options
	    selector.removeChild(selector.lastChild);
	}

	nodeList.forEach(function (d, i){
	
		if (d.novel == true) {
		    var option = document.createElement('option');
			option.value = d.id;
			option.innerHTML = d.name.substr(0,30) + " (edges: " + d.edgeCount + ")";
			selector.appendChild(option);
		}
		
	});
}

function setEdgeCounts(net){

	for (var i = 0; i < networks[net].nodes.length; i++){
		
		networks[net].nodes[i].edgeCount = findPredicateCount(networks[net].nodes[i]);
		
	}
	
}

function findPredicateCount(node){

	var count = 0;
	
	for (var i = 0; i < networks[node.network].links.length; i++){
		
		if (networks[node.network].links[i].source == node || networks[node.network].links[i].target == node) { 

				for (var j = 0; j < networks[node.network].links[i].predicate.length; j++){

					if (findRelevanceRule(networks[node.network].links[i].predicate[j].label, 
						networks[node.network].links[i].source.semtype, networks[node.network].links[i].target.semtype) != -1
						
						) { count++; break; }					
				}
		}
	}
	return count;
}

function getSelectedNetwork() {
	
	var net = document.getElementById('networkSelector').value;

	for (var i = 0; i < networks.length; i++) {

		if (networks[i].id == net) return networks[i];
	}
	
	return null;
}

function getSelectedSeed() {
	
	var selected = document.getElementById('seedSelector').value;

	for (var i = 0; i < selection.network.nodes.length; i++) {

		if (selection.network.nodes[i].id == selected) return selection.network.nodes[i];
	}
	
	// if not found return most connected node
	return getMostConnectedNode(selection.network);
}

function getSelectedConnections() {
	
	var selected = document.getElementById('connectivitySelector').value;	
	return selected;
}
/*
function getSelectedSaliency() {
	
	var selected = document.getElementById('saliencyCheck').checked;	
	return selected;
}
*/
function getSelectedMaxNodes() {
	
	var selected = $("input[name=maxNodes]:checked").val();
	return selected;
}

//Domains
var summarizationSchema = [
	{   
        "sumType":"pharmgen",
        "display":"Pharmacogenomics",
        "unconnectedPreds":[],
        "dominantPreds":["TREATS", "PREVENTS", "ISA", "PROCESS_OF"],
        "domains":
         [
         {"id":"drugs", "semtypes":["aapp", "antb", "gngm", "hops", "horm",	"orch", "phsu", "strd", "vita"]},

         {"id":"chemicals", "semtypes":["aapp", "antb", "bacs", "carb", "eico",	"elii", "enzy", "gngm", "hops", "horm",
        	"imft", "inch", "lipd", "nnon", "nsba",	"opco", "orch", "phsu", "strd", "vita"]},
             			 
         {"id":"physiology", "semtypes":["biof", "celf", "comd", "genf", "menp", "moft", "orgf", "ortf", "phsf"]},
         
		 {"id":"substance", "semtypes":["aapp", "antb", "bacs", "carb", "eico", "elii", "enzy", "gngm", "hops", "horm", 
		 	"imft", "inch",	"lipd", "nsba", "nusq", "orch", "opco", "phsu", "rcpt", "strd", "vita"]},
             		
         {"id":"anatomy", "semtypes":["anst", "bpoc", "cell", "celc", "emst", "ffas", "gngm", "neop", "tisu"]},

		 {"id":"livingbeing","semtypes":["anim", "arch", "bact", "fngs", "humn", "invt", "mamm", "orgm", "vtbt", "podg", "popg"]}, 

		 {"id":"org","semtypes":["aggp", "anim", "arch", "bact", "famg", "fngs", "grup", "humn", "invt", "mamm", "orgm", "podg",
			"popg", "prog", "vtbt"]}, 

		 {"id":"disorders","semtypes":["acab", "anab", "cgab", "comd", "dsyn", "inpo", "mobd", "neop", "patf", "sosy"]}, 

		 {"id":"process","semtypes":["acab", "anab", "biof", "celf", "comd", "cgab", "dsyn", "inpo", "mobd", "menp", "moft", 
		 	"neop",	"npop", "orgf", "ortf", "phsf", "patf", "sosy"]},

		 {"id":"pathology","semtypes":["acab", "anab", "comd", "cgab", "dsyn", "inpo", "mobd", "neop", "patf", "sosy"]}
		 ],
		"rules":
		 [
		 {"label":"CAUSES", "typePairs":[{"subject":"substance","object":"pathology"}]},
		 {"label":"ASSOCIATED_WITH", "typePairs":[{"subject":"substance","object":"pathology"}]},
		 {"label":"PREDISPOSES", "typePairs":[{"subject":"substance","object":"pathology"}]},
		 {"label":"INTERACTS_WITH", "typePairs":[{"subject":"substance","object":"substance"}]},
		 {"label":"INHIBITS", "typePairs":[{"subject":"substance","object":"substance"}]},
		 {"label":"STIMULATES", "typePairs":[{"subject":"substance","object":"substance"}]},
		 {"label":"CONVERTS_TO", "typePairs":[{"subject":"substance","object":"substance"}]},
		 {"label":"TREATS", "typePairs":[{"subject":"drugs","object":"pathology"}]},
		 {"label":"ADMINISTERED_TO", "typePairs":[{"subject":"drugs","object":"pathology"}]},
		 {"label":"PART_OF", "typePairs":[{"subject":"substance","object":"livingbeing"}]},
		 {"label":"PROCESS_OF", "typePairs":[{"subject":"pathology","object":"livingbeing"}]},
		 {"label":"AFFECTS", "typePairs":[{"subject":"substance","object":"anatomy"},{"subject":"substance","object":"process"}]},
		 {"label":"AUGMENTS", "typePairs":[{"subject":"substance","object":"anatomy"},{"subject":"substance","object":"process"}]},
		 {"label":"DISRUPTS", "typePairs":[{"subject":"substance","object":"anatomy"},{"subject":"substance","object":"process"}]},
		 {"label":"COEXISTS_WITH", "typePairs":[{"subject":"pathology","object":"pathology"},{"subject":"substance","object":"substance"}]},
		 {"label":"MANIFESTATION_OF", "typePairs":[{"subject":"pathology","object":"pathology"}]},
		 {"label":"LOCATION_OF", "typePairs":[{"subject":"anatomy","object":"substance"}]},
		 {"label":"ISA", "typePairs":[{"subject":"chemicals","object":"chemicals"}]}
		 ]
	},
             			
	{   
		"sumType":"treatment",
		"display":"Treatment",
        "unconnectedPreds":["LOCATION_OF", "PROCESS_OF", "COEXISTS_WITH"],
		"dominantPreds":["PROCESS_OF"],
		"domains":
		 [
		 {"id":"disorders","semtypes":["acab", "anab", "cgab", "comd", "dsyn", "inpo", "mobd", "neop", "patf", "sosy"]}, 

		 {"id":"cancause","semtypes":["aapp", "antb", "bacs", "bact", "elii", "fngs", "gngm", "hops", "imft", "invt", "opco", 
						"rich", "virs"]}, 

		 {"id":"orgcause","semtypes":["bact", "fngs", "invt", "rich", "virs"]}, 

		 {"id":"canchem","semtypes":["aapp", "antb", "bacs", "carb", "eico", "elii", "gngm", "hops", "horm", "imft", "lipd", 
		 				"opco", "orch", "phsu", "strd", "topp", "vita"]}, 

		 {"id":"cantreat","semtypes":["aapp", "antb", "carb", "eico", "elii", "gngm", "horm", "lipd", "orch", "phsu", "strd", 
		 				"topp", "vita"]},

		 {"id":"human","semtypes":["aggp", "famg", "grup", "humn", "podg", "popg", "prog"]},

		 {"id":"canbeloc","semtypes":["blor", "bpoc", "bsoj", "ffas"]}, 

		 {"id":"cancauselivb","semtypes":["bact", "fngs", "invt", "rich", "virs"]}, 

		 {"id":"agegroup","semtypes":["humn"]}
		 ],
		"rules":
		 [
		 {"label":"CAUSES", "typePairs":[{"subject":"cancause","object":"disorders"}]},
		 {"label":"TREATS", "typePairs":[{"subject":"cantreat","object":"disorders"}]},
		 {"label":"PREVENTS", "typePairs":[{"subject":"cantreat","object":"disorders"}]},
		 {"label":"LOCATION_OF", "typePairs":[{"subject":"canbeloc","object":"disorders"}]},
		 {"label":"COEXISTS_WITH", "typePairs":[{"subject":"disorders","object":"disorders"}]},
		 {"label":"PROCESS_OF", "typePairs":[{"subject":"disorders","object":"disorders"},{"subject":"disorders","object":"agegroup"}]},
		 {"label":"ISA", "typePairs":[{"subject":"disorders","object":"disorders"},{"subject":"cancause","object":"cancause"},
		 {"subject":"canchem","object":"canchem"}]}
		 ]
	},
		
    {   
        "sumType":"interaction",
        "display":"Substance Interactions",
        "unconnectedPreds":["TREATS", "ISA", "PREVENTS", "PROCESS_OF"],
        "dominantPreds":["TREATS", "PREVENTS", "ISA", "PROCESS_OF"],
        "vocabularies":["CSP", "RCD", "MSH"],
        "domains":
         [
         {"id":"drugs", "semtypes":["aapp", "antb", "gngm", "hops", "horm",	"nnon", "orch", "phsu", "strd", "vita"]},

         {"id":"chemicals", "semtypes":["aapp", "antb", "bacs", "carb", "eico",	"elii", "enzy", "gngm", "hops", "horm",
        	"imft", "inch", "lipd", "nnon", "nsba",	"opco", "orch", "phsu", "strd", "vita"]},

         {"id":"disorders", "semtypes":["acab", "anab", "cgab", "comd", "dsyn", "inpo", "mobd", "neop", "patf", "sosy"]}, 
             			 
         {"id":"physiology", "semtypes":["biof", "celf", "comd", "genf", "menp", "moft", "orgf", "ortf", "phsf"]},
             		
         {"id":"anatomy", "semtypes":["anst", "bpoc", "cell", "celc", "emst", "ffas", "gngm", "tisu"]}
         ],
		"rules":
         [
		 {"label":"CAUSES", "typePairs":[{"subject":"drugs","object":"disorders"}]},
		 {"label":"TREATS", "typePairs":[{"subject":"drugs","object":"disorders"}]},
		 {"label":"PREVENTS", "typePairs":[{"subject":"drugs","object":"disorders"}]},
		 {"label":"DISRUPTS", "typePairs":[{"subject":"drugs","object":"anatomy"},{"subject":"drugs","object":"physiology"}]},
		 {"label":"INTERACTS_WITH", "typePairs":[{"subject":"drugs","object":"chemicals"},{"subject":"chemicals","object":"drugs"}]},
		 {"label":"AFFECTS", "typePairs":[{"subject":"drugs","object":"disorders"},{"subject":"drugs","object":"physiology"}]},
		 {"label":"COMPLICATES", "typePairs":[{"subject":"drugs","object":"disorders"},{"subject":"drugs","object":"physiology"}]},
		 {"label":"ISA", "typePairs":[{"subject":"drugs","object":"chemicals"}]}
		 ]
        },
             			
		{   
		"sumType":"diagnosis",
		"display":"Diagnosis",
        "unconnectedPreds":["LOCATION_OF", "PROCESS_OF", "COEXISTS_WITH"],
		"dominantPreds":["PROCESS_OF"],
		"domains":
		 [
		 {"id":"disorders","semtypes":["acab", "anab", "cgab", "comd", "dsyn", "inpo", "mobd", "neop", "patf", "sosy"]}, 

		 {"id":"cancause","semtypes":["aapp", "antb", "bacs", "bact", "elii", "fngs", "gngm", "hops", "imft", "invt", "opco", 
						"rich", "virs"]}, 

		 {"id":"candiagnose","semtypes":["diap", "lbpr", "sosy"]}, 

		 {"id":"canchem","semtypes":["aapp", "antb", "bacs", "carb", "eico", "elii", "gngm", "hops", "horm", "imft", "lipd", "opco", 
	   					"orch", "phsu", "strd", "topp", "vita"]},

		 {"id":"human","semtypes":["aggp", "famg", "grup", "humn", "podg", "prog"]},

		 {"id":"canbeloc","semtypes":["blor", "bpoc", "bsoj", "ffas"]}, 

		 {"id":"cancauselivb","semtypes":["bact", "fngs", "invt", "rich", "virs"]}, 

		 {"id":"agegroup","semtypes":["humn"]}
		 ],
		"rules":
		 [
		 {"label":"CAUSES", "typePairs":[{"subject":"cancause","object":"disorders"}]},
		 {"label":"DIAGNOSES", "typePairs":[{"subject":"candiagnose","object":"disorders"}]},
		 {"label":"LOCATION_OF", "typePairs":[{"subject":"canbeloc","object":"disorders"}]},
		 {"label":"COEXISTS_WITH", "typePairs":[{"subject":"disorders","object":"disorders"}]},
		 {"label":"PROCESS_OF", "typePairs":[{"subject":"disorders","object":"disorders"},{"subject":"disorders","object":"agegroup"}]},
		 {"label":"ISA", "typePairs":[{"subject":"disorders","object":"disorders"}]}
		 ]
	},
             			
	{   
		"sumType":"all",
		"display":"All Relations",
        "unconnectedPreds":[],
		"dominantPreds":["ISA"],
		"domains":
		 [
		 {"id":"all","semtypes":["acab", "acty", "aggp", "alga", "amas", "aapp", "amph", "anab", "anst", "anim", "antb", 
		                              "arch", "bact", "bhvr", "biof", "bacs", "bmod", "bodm", "bird", "blor", "bpoc", "bsoj", 
		                              "bdsy", "carb", "crbs", "cell", "celc", "celf", "comd", "chem", "chvf", "chvs", "clas", 
		                              "clna", "clnd", "cnce", "cgab", "dora", "diap", "dsyn", "drdd", "edac", "eico", "elii", 
		                              "emst", "enty", "eehu", "enzy", "evnt", "emod", "famg", "fndg", "fish", "food", "ffas",
		                              "ftcn", "fngs", "gngp", "gngm", "genf", "geoa", "gora", "grup", "grpa", "hops", "hlca", 
		                              "hcro", "horm", "humn", "hcpp", "idcn", "imft", "irda", "inbe", "inpo", "inch", "inpr",
		                              "invt", "lbrp", "lbtr", "lang", "lipd", "mcha", "mamm", "mnob", "medd", "menp", "mobd", 
		                              "mbrt", "moft", "mosq", "npop", "neop", "nsba", "nonn", "nusq", "ocdi", "ocac", "ortf", 
		                              "orch", "orgm", "orga", "orgf", "orft", "opco", "patf", "podg", "phsu", "phpr", "phob",
		                              "phsf", "plnt", "popg", "pros", "prog", "qlco", "qnco", "rcpt", "rnlw", "rept", "resa", 
		                              "resd", "rich", "shro", "sosy", "socb", "spco", "strd", "sbst", "tmco", "topp", "tisu",
		                              "vtbt", "virs", "vita"]}
		 ],
		"rules":
		 [
		 {"label":"ADMINISTERED_TO", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"AFFECTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"ASSOCIATED_WITH", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"AUGMENTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"CAUSES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"COEXISTS_WITH", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"COMPLICATES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"CONVERTS_TO", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"DIAGNOSES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"DISRUPTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"INHIBITS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"INTERACTS_WITH", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"ISA", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"LOCATION_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"MANIFESTATION_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"METHOD_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_ADMINISTERED_TO", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_AFFECTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_ASSOCIATED_WITH", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_AUGMENTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"CAUSES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_COEXISTS_WITH", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_CAUSES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_COMPLICATES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_CONVERTS_TO", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_DIAGNOSES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_DISRUPTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_INTERACTS_WITH", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_INHIBITS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_LOCATION_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_MANIFESTATION_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_METHOD_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_OCCURS_IN", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_PART_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_PRECEDES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_PROCESS_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_PREDISPOSES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_PREVENTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_PRODUCES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_STIMULATES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_TREATS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_USES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"OCCURS_IN", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"PART_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"PRECEDES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"PREDISPOSES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"PREVENTS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"PROCESS_OF", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"PRODUCES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"STIMULATES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"TREATS", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"USES", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"compared_with", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"higher_than", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"lower_than", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_higher_than", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"NEG_lower_than", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"same_as", "typePairs":[{"subject":"all","object":"all"}]},
		 {"label":"than_as", "typePairs":[{"subject":"all","object":"all"}]}
		 ]
	}
	
]; 

///////////////////////////////////////////////////////////////////////
// summarize
//
//	main function to start summarization of network.
//	uses selections from summary panel.
//
///////////////////////////////////////////////////////////////////////
function summarize() {

	setSummarySelection(); // fill selection.network, selection.summarization, selection.seed];

	deleteNetwork(selection.network.id, 1); // delete selected network in SVG1
	
	relevance();
	connectivity();
	if (selection.connections > 0) extendConnections();
	
	if (selection.maxNodes != 1000) { // 1000 = return all
		saliency();
		pushSalient(); // copy salient nodes and links from summary arrays to SVG1 arrays
	} 
	else {
		pushSummarized(); // copy nodes and links from summary arrays to SVG1 arrays
	}


	// anchor = highest degree node
	setDegree(nodes);

	var Anchor = setAnchor(selection.network.id);
	createAnchorGradient(Anchor);

	start();

	resetPredCheckboxes();
	resetSemGroupCheckboxes();
	
	freezeNetwork(true); // unfreeze all networks

	// fade in
	svg1.style("opacity", function(){return 1e-6;})
		.transition()
		.duration(2000)
		.style("opacity", function(){return 1;});
}
	
function setSummarySelection() { // fill selection.network, .summarization, .seed, .connections, .maxNodes

	selection.network = getSelectedNetwork();
	if (selection.network == null) selection.network = networks[networks.length - 1];

	selection.summarization = getSelectedSchema();
	if (selection.summarization == null) selection.summarization = summarizationSchema[0];

	selection.seed = getSelectedSeed();
	if (selection.seed == null) selection.seed = getMostConnectedNode(selection.network.id);

	selection.connections = getSelectedConnections();
	if (selection.connections == null) selection.connections = 2;
	
	selection.maxNodes = getSelectedMaxNodes();
	if (selection.maxNodes == null) selection.maxNodes = 1; // Udo Hahn cutoff as default
}

function pushSummarized() {

	for (var i = 0; i < summaryNodes.length; i++) nodes.push(summaryNodes[i]);
	for (var j = 0; j < summaryLinks.length; j++) links.push(summaryLinks[j]);

	summaryNodes.length = 0;
	summaryLinks.length = 0;

}


function pushAll() {

	for (var i = 0; i < selection.network.nodes.length; i++) nodes.push(selection.network.nodes[i]);
	for (var j = 0; j < selection.network.links.length; j++) links.push(selection.network.links[j]);		
}

function pushSalient() {

	for (var i = 0; i < summaryLinks.length; i++) {
		for (var j = 0; j < summaryLinks[i].predicate.length; j++) {
			
			if (summaryLinks[i].predicate.salient == true) {
	
				//position in middle of canvas				  
				summaryLinks[i].source.x = summaryLinks[i].target.x = width/2;
				summaryLinks[i].source.y = summaryLinks[i].target.y = height/2;

				if (findNode(summaryLinks[i].source.id, nodes) == -1) nodes.push(summaryLinks[i].source);

				if (findNode(summaryLinks[i].target.id, nodes) == -1) nodes.push(summaryLinks[i].target);

				var linkFound = findLink(summaryLinks[i], links);
				if (linkFound != -1) { // link exists

					var predicateFound = findPredicate(summaryLinks[i].predicate[j], links[linkFound] );

					if (predicateFound == -1 ) { // predicate doesn't exist

						links[linkFound].predicate.push(summaryLinks[i].predicate[j]);
					}
							
				} else { 
						
					var link1 = { source:"", target:"", sColor:"black",
							predicate:[{label:"", sentence:[{PMID:"", SID:"", sNumber:"", abti:"", text:""}] }] };
					link1.source = summaryLinks[i].source;
					link1.target = summaryLinks[i].target;
					link1.predicate[0] = summaryLinks[i].predicate[j];
					link1.sColor = "black";				
					links.push(link1); 
				}

			} // predication is salient

		} // for each predicate in summaryLinks[i]
		
	} // for each link in summaryLinks

	summaryNodes.length = 0;
	summaryLinks.length = 0;

}

////////////////////////////////////////////////////////////////////////////////////
// relevance()
//
// calculates the relevance for all links based on the selected summarization type.
// sets the relevance to true or false at the predication level within the link.
//
// based on PERL script subroutine Relevance:
//##################################################################################
//# Relevance: Finds the relevant predications by checking the predications
//# against the schema constraints.
//# Takes in a hash of filtered relations, and returns a hash of relevant relations.
//##################################################################################
////////////////////////////////////////////////////////////////////////////////////
function relevance() { 

	for (var i = 0; i < selection.network.links.length; i++) { // for each link
		if ((selection.network.links[i].source == selection.seed || selection.network.links[i].target == selection.seed) && // one of the arguments is the seed
			(selection.network.links[i].source != selection.network.links[i].target ) &&			// link is not circular (subject != object)
			(selection.network.links[i].source.novel == true && selection.network.links[i].target.novel == true)) { // arguments are novel

			for (var j = 0; j < selection.network.links[i].predicate.length; j++) { 	// for each predicate of each link

				var checkRule = findRelevanceRule(selection.network.links[i].predicate[j].label, 
						  			selection.network.links[i].source.semtype, selection.network.links[i].target.semtype);

				if (checkRule != -1) {

					//position in middle of canvas				  
					selection.network.links[i].source.x = selection.network.links[i].target.x = width/2;
					selection.network.links[i].source.y = selection.network.links[i].target.y = height/2;
					selection.network.links[i].source.fixed = selection.network.links[i].target.fixed = false;

					if (findNode(selection.network.links[i].source.id, summaryNodes) == -1) summaryNodes.push(selection.network.links[i].source);

					if (findNode(selection.network.links[i].target.id, summaryNodes) == -1) summaryNodes.push(selection.network.links[i].target);

					var linkFound = findLink(selection.network.links[i], summaryLinks);

					if (linkFound != -1) { // link exists

						var predicateFound = findPredicate(selection.network.links[i].predicate[j], summaryLinks[linkFound] );

						if (predicateFound == -1 ) { // predicate doesn't exist

							summaryLinks[linkFound].predicate.push(selection.network.links[i].predicate[j]);
						}
							
					} else { summaryLinks.push(selection.network.links[i]); }
						
				} // found relevance rule

			} // for each predicate of each link
						
		} // one of the arguments is the seed node AND link is not circular AND arguments are novel
		
	} // for each link

}

///////////////////////////////////////////////////////////////////
// findRelevanceRule
//
//	returns the index of the rule (RULE.PAIR) or -1 if not found
// 	
//	label = the predicate (e.g. ISA)
//	subSemtype = the semantic type of the subject
//	objSemtype = the semantic type of the object
/////////////////////////////////////////////////////////////////////
function findRelevanceRule(label, subSemtype, objSemtype) {

		for (var j = 0; j < selection.summarization.rules.length; j++) {
			
			if (selection.summarization.rules[j].label == label){
		
				for (var k = 0; k < selection.summarization.rules[j].typePairs.length; k++) {

					var foundSubject = findSemtypeInDomain(subSemtype, selection.summarization.rules[j].typePairs[k].subject);
					var foundObject = findSemtypeInDomain(objSemtype, selection.summarization.rules[j].typePairs[k].object);

					if (foundSubject != -1 && foundObject != -1)  return j + "." + k;
					
				} // for each rule's semantic type pair		
			
			} // if correct predicate
				
		} // for each rule

	return -1;
}

//////////////////////////////////////////////////////////////////
// findSemtypeInDomain
//
//	inType = semantic type to check
//	domain = the specified domain in summarizationSchema (e.g. disorders)
//
//////////////////////////////////////////////////////////////////
function findSemtypeInDomain(inType, domain){
	
	for (var j = 0; j < selection.summarization.domains.length; j++) {
				
		if (selection.summarization.domains[j].id == domain) {
					
			for (var k = 0; k < selection.summarization.domains[j].semtypes.length; k++) {
						
				if (selection.summarization.domains[j].semtypes[k] == inType) {
					return j + "." + k;
				}
			}
			
		} // found the correct domain
		
	} // for each domain in the selected summarization
			
	return -1;
}

////////////////////////////////////////////////////////////////////////////////////
// connectivity()
//
//################################################################################
//# Connectivity: Adds predications to the condensate by finding those that are
//# connected to the seed concept through one and only one concept.
//# Takes in a hash of relevant relations, and returns a hash of connected relations.
//#################################################################################
////////////////////////////////////////////////////////////////////////////////////
function connectivity() {

	for (var i = 0; i < selection.network.links.length; i++) { // for each link {
	
		if ((selection.network.links[i].source == selection.seed || selection.network.links[i].target == selection.seed) &&		// link contains seed
			(selection.network.links[i].source != selection.network.links[i].target ) &&										// link is not circular (subject != object)
			(selection.network.links[i].source.novel == true && selection.network.links[i].target.novel == true)) { 			// arguments are novel
		
			for (var j = 0; j < selection.network.links[i].predicate.length; j++) { 	// for each predicate of each link
		
				// if predication is not excluded for the domain and meets relevance criteria than add it
				if (findUnconnectedPreds(selection.network.links[i].predicate[j].label) == -1 
					&& findRelevanceRule(selection.network.links[i].predicate[j].label, selection.network.links[i].source.semtype, 
							selection.network.links[i].target.semtype) != -1) {
					

					//position in middle of canvas				  
					selection.network.links[i].source.x = selection.network.links[i].target.x = width/2;
					selection.network.links[i].source.y = selection.network.links[i].target.y = height/2;
					selection.network.links[i].source.fixed = selection.network.links[i].target.fixed = false;
				
					if (findNode(selection.network.links[i].source.id, summaryNodes) == -1) summaryNodes.push(selection.network.links[i].source);

					if (findNode(selection.network.links[i].target.id, summaryNodes) == -1) summaryNodes.push(selection.network.links[i].target);
			
					var linkFound = findLink(selection.network.links[i], summaryLinks);

					if (linkFound != -1) { // link exists

						var predicateFound = findPredicate(selection.network.links[i].predicate[j], summaryLinks[linkFound] );

						if (predicateFound == -1 ) { // predicate doesn't exist

							summaryLinks[linkFound].predicate.push(selection.network.links[i].predicate[j]);
						}
							
					} else { summaryLinks.push(selection.network.links[i]); }
				}
			} 
		}
	}
}

//////////////////////////////////////////////////////////////////
// findUnconnectedPreds(label)
//
//  Returns the position of the excluded predicate or -1 if it is 
//	not found.
// 
//	label = predication label to compare against the unconnectedPreds 
//			list for the current summarization schema.
//
//////////////////////////////////////////////////////////////////
function findUnconnectedPreds(label) {
	
	for (var j = 0; j < selection.summarization.unconnectedPreds.length; j++) {
			
		if (selection.summarization.unconnectedPreds[j] == label) {
					
			return j;
		}
	}

	return -1;
}

////////////////////////////////////////////////////////////////////////////////////
// extendConnections()
//
//	increases length of links from seed according to selection.connections
////////////////////////////////////////////////////////////////////////////////////
function extendConnections() {

  for (var iteration = 0; iteration < selection.connections; iteration++) {
  
    var nodesCopy = [];
	summaryNodes.forEach(function (d){nodesCopy.push(d);});

	for (var i = 0; i < selection.network.links.length; i++) { // for each link {
	
		var subjectFound = findNode(selection.network.links[i].source.id, nodesCopy);
		var objectFound  = findNode(selection.network.links[i].target.id, nodesCopy);

		if ((subjectFound == -1 || objectFound == -1) && (!(subjectFound == -1 && objectFound == -1))  &&				// only one concept is in graph (else already present)
			(selection.network.links[i].source.novel == true && selection.network.links[i].target.novel == true) ) { 	// arguments are novel

			for (var j = 0; j < selection.network.links[i].predicate.length; j++) { 	// for each predicate of each link
		
				if (findUnconnectedPreds(selection.network.links[i].predicate[j].label) == -1 &&									// predication is not excluded for domain 
						findRelevanceRule(selection.network.links[i].predicate[j].label, selection.network.links[i].source.semtype, // predication fits within a domain rule
								selection.network.links[i].target.semtype) != -1) {
				
					if (findNode(selection.network.links[i].source.id, summaryNodes) == -1) summaryNodes.push(selection.network.links[i].source);
					if (findNode(selection.network.links[i].target.id, summaryNodes) == -1) summaryNodes.push(selection.network.links[i].target);

					var linkFound;
					if (summaryLinks.length > 0) linkFound = findLink(selection.network.links[i], summaryLinks);
					else linkFound = -1;
	

					if (linkFound != -1) { // link exists

						var predicateFound = findPredicate(selection.network.links[i].predicate[j], summaryLinks[linkFound] );	
						
						if (predicateFound == -1 ) { // predicate doesn't exist

							summaryLinks[linkFound].predicate.push(selection.network.links[i].predicate[j]);	
						}
							
					} else { summaryLinks.push(selection.network.links[i]); }
					
				} // not in unconnectedPreds list
				
			} // for each predicate
			
		} // object or subject found
		
	} // for each link
	
  } // iterations
}

/////////////////////////////////////////////////////////////////////////////////////
// function saliency()
// calculates the saliency of the concepts and predications in 
// from original script:
//###################################################################################
//# Saliency: Removes predications from the condensate by by applying Udo Hahn's
//# saliency operators.

//###################################################################################
/////////////////////////////////////////////////////////////////////////////////////
function saliency() {

	var conceptCount = countConcepts(); // go through each predication and add the subject/object to an array returned with total and unique counts
	var avgActivationWeight = computeAvgActivationWeight(conceptCount); // use the counts from above to calc the average count for all

	setSC1(conceptCount, avgActivationWeight); 						// map counts >= average to true and rest to false

	// Calculate SC3 - repeat SC1 using the unique predications count
	setAvgSumOther(conceptCount);  	// calc average of all other concepts for each concept
	setSC3(conceptCount); 	// SC3 is SC2 of concepts from unique predications
	setSalient(conceptCount); // set summaryLinks[i].predicate[j].salient = true if subj AND obj both true by SC1 or SC3.

/* not in production version
	var predicationCount = countPredications();
	balancePredications(predicationCount);
	computeSRC1(predicationCount);
	return join of conceptCount.SC1==true, uniqueConceptCount.SC3==true, relationCount??? and predicationCount.SRC1==true;
*/

}

///////////////////////////////////////////////////////////////////////////////////
// function countConcepts() 
//
// returns an array of each unique concept in summaryLinks (subjects and objects)
// with its count as either subject or object
///////////////////////////////////////////////////////////////////////////////////
function countConcepts() {

	var counts = [];

	for (var i = 0; i < summaryLinks.length; i++) {
		
		for (var j = 0; j < summaryLinks[i].predicate.length; j++) {

			// subject
			var conceptFound = findConcept(summaryLinks[i].source, counts);

			if (conceptFound == -1) { // predication not found
		
				var count1 = [];	
				count1.concept = summaryLinks[i].source;
				count1.count = summaryLinks[i].predicate[j].sentence.length;
				count1.uniqueCount = 1; 
				counts.push(count1);
				
			} else { // concept found

				counts[conceptFound].count += summaryLinks[i].predicate[j].sentence.length;
				counts[conceptFound].uniqueCount++;
			
			} // concept found
		
			// object
			conceptFound = findConcept(summaryLinks[i].target, counts);

			if (conceptFound == -1) { // predication not found
		
				var count2 = [];	
				count2.concept = summaryLinks[i].target;
				count2.count = summaryLinks[i].predicate[j].sentence.length;
				count2.uniqueCount = 1;
				counts.push(count2);
				
			} else { // concept found

				counts[conceptFound].count += summaryLinks[i].predicate[j].sentence.length;
				counts[conceptFound].uniqueCount++;
			
			} // concept found
		
		} // for each predicate in summaryLinks[i]
		    
	} // for each link
	
return counts;
}

// findConcept(concept, set) - returns the index of the concept in the set
function findConcept(concept, set) {
	
	for (var i = 0; i < set.length; i++) { 
		if (set[i].concept == concept) return i; 
	}
	
	return -1;
}

/////////////////////////////////////////////////////////////////////////////////
//###############################################################################
//# ComputeAvgActivationWeight: Computes average activation weight for a hash of
//# concept frequencies.
//# Returns a numeric value.
//###############################################################################
/////////////////////////////////////////////////////////////////////////////////
function computeAvgActivationWeight(count) {
	
	var total = 0;
	var maxNodes;
	
	count = count.sort(function(a, b) { return d3.descending(a.uniqueCount, b.uniqueCount); });

	maxNodes = (selection.maxNodes > count.length) ? count.length : selection.maxNodes;

	if (selection.maxNodes == 1) { // Udo Hahn's most salient/higher than average
		
		for (var i = 0; i < count.length; i++) { total += count[i].count; }

		if (count.length == 0) averageActivationWeight = -1;
		else averageActivationWeight = total/count.length;
	
		return averageActivationWeight;
		
	} else return count[maxNodes-1].count; // use numeric cutoff instead of higher than average.
}

/////////////////////////////////////////////////////
// function setSC1(conceptCount, avgActivationWeight)
// set counts >= average to true and rest to false
/////////////////////////////////////////////////////
function setSC1(conceptCount, avgActivationWeight) { 
	
	for (var i = 0; i < conceptCount.length; i++) { 
		conceptCount[i].SC1 = conceptCount[i].count >= avgActivationWeight ? true : false; 
	}
}

//////////////////////////////////////////////////////////////////////
// function setAvgSumOther(conceptCount)
//
// calculate the average count of all other concepts for each concept
//////////////////////////////////////////////////////////////////////
function setAvgSumOther(conceptCount) {
	
	var totalCount = 0;


	conceptCount = conceptCount.sort(function(a, b) { return d3.descending(a.uniqueCount, b.uniqueCount); });
	maxNodes = (selection.maxNodes > conceptCount.length) ? conceptCount.length : selection.maxNodes;
	
	// set avgSumOther
	if (selection.maxNodes == 1) { // Udo Hahn's most salient/higher than average
		
		// count total of uniqueCounts
		for (var i = 0; i < conceptCount.length; i++) { totalCount += conceptCount[i].uniqueCount; }
				
		for (var i = 0; i < conceptCount.length; i++) { 
			conceptCount[i].avgSumOther = (totalCount - conceptCount[i].uniqueCount) / (conceptCount.length - 1); 
		}
		
	} else {
		
		for (var i = 0; i < conceptCount.length; i++) { 
			conceptCount[i].avgSumOther = conceptCount[maxNodes-1].uniqueCount; // use numeric cutoff instead of higher than average. 
		}
		
	}
}

/////////////////////////////////////////////////////
//function setSC3(conceptCount)
//set uniqueCounts >= avgSumOther to true and rest to false
/////////////////////////////////////////////////////
function setSC3(conceptCount) { 

	for (var i = 0; i < conceptCount.length; i++) { 
		conceptCount[i].SC3 = conceptCount[i].uniqueCount >= conceptCount[i].avgSumOther ? true : false; 
	}
}

//set summaryLinks[i].predicate[j].salient = true if subject and object are both true by SC1 or SC3.
function setSalient(conceptCount) {

	for (var i = 0; i < summaryLinks.length; i++) {
		
		for (var j = 0; j < summaryLinks[i].predicate.length; j++) {
			
			summaryLinks[i].predicate.salient = false; // default value is false.

			var subjectFound = findConcept(summaryLinks[i].source, conceptCount);
			var objectFound = findConcept(summaryLinks[i].target, conceptCount);
			
			if (subjectFound != -1 && objectFound != -1) {
				
				if ( (conceptCount[subjectFound].SC1 == true || conceptCount[subjectFound].SC3 == true) 
					&& (conceptCount[objectFound].SC1 == true || conceptCount[objectFound].SC3 == true) )
					summaryLinks[i].predicate.salient = true;
				
			} // subject and object both have count (all should have a count by now)
			
		} // for each predicate	
		
	} // for each link
	
}

///////////////////////////////////////////////////////////////////////////////////
//#################################################################################
//# CountPredications: Computes the frequencies of predications in links.
//# Return an array of frequencies.
//#################################################################################
///////////////////////////////////////////////////////////////////////////////////
function countPredications() {

	var counts = [];

	for (var i = 0; i < summaryLinks.length; i++) {
		
		for (var j = 0; j < summaryLinks[i].predicate.length; j++) {

			var predicationFound = findPredication(summaryLinks[i].source, summaryLinks[i].predicate[j].label, summaryLinks[i].target, counts);

			if (predicationFound == -1) { // predication not found
		
				var predication1 = [];	
				predication1.source = summaryLinks[i].source;	
				predication1.target = summaryLinks[i].target;	
				predication1.predicate = summaryLinks[i].predicate[j].label;
				predication1.count = summaryLinks[i].predicate[j].sentence.length;
				counts.push(predication1);
				
			} else { // predication found

				counts[predicationFound].count += summaryLinks[i].predicate[j].sentence.length;
			
			} // predication found
		
		} // for each predicate in summaryLinks[i]
		    
	} // for each link
	
return counts;
}

function findPredication(subj, pred, obj, array1) {

	for (var i = 0; i < array1.length; i++) {
	
		if ( (array1[i].source == subj) && (array1[i].target == obj) 
		&& (array1[i].predicate == pred) ) 	return i;
		
	}
	
	return -1; // not found

}

////////////////////////////////////////////////////////////////////////////////////////
// function balancePredications(predicationCount, balanceCoefficient)
//
// for each predication in the passed predication count list
// add sentence counts to the predication total for each predication
// PREVENTS and TREATS are grouped together
// add counts of predications that are in the dominantPreds list to dominantSum 
// and increment dominantDistinctCount
// add counts of predications that are NOT in the dominanPreds list to othersSum
// and increment othersDistinctCount
// if divisors are > 0, balanceCoefficient = ( (dominantCount/dominantDistinctCount) / (othersCount/othersDistinctCount) )
// otherWise set balanceCoefficient t0 1;
// use balanceCoefficient to balance all non dominant predications
//
// based on:
// ComputeBalanceCoefficient AND BalancePredications
//////////////////////////////////////////////////////////////////////////////////////////
function balancePredications(count) {

	// Calculate balanceCoefficient
	var dominantSum = 0;
	var othersSum = 0;
	var dominantDistinctCount = 0;
	var othersDistinctCount = 0;	
	for (var i = 0; i < count.length; i++) {
		
		if (findDominant(count[i].predicate) != -1) {
			dominantSum += count[i].count;
			dominantDistinctCount++;
		} else {
			othersSum += count[i].count;
			othersDistinctCount++;
		}
	}

	var balanceCoefficient;
	if (dominantDistinctCount > 0 && othersSum > 0) {
		balanceCoefficient = ( (dominantSum/dominantDistinctCount)/(othersSum/othersDistinctCount) );
	} else balanceCoefficient = 1;
	
	// Set balancedCount for each predication
	for (var j = 0; j < count.length; j++) {

		if (findDominant(count[j].predicate) == -1) {		
			count[j].balancedCount = count[j].count * balanceCoefficient;
		} else {
			count[j].balancedCount = count[j].count;
		}
	}

}

/////////////////////////////////////////////////////////////////////////////////////////
//computeSRC1(averageActivationWeight, predicationCount)
//
//based on: 
//##################################################################################
//# ComputeAvgActivationWeight: Computes average activation weight for a hash of
//# concept frequencies.
//# Returns a numeric value.
//##################################################################################
//AND
//#######################################################################################
//# ComputeSRC1: Creates a hash of saliency based on the saliency of predications.
//# (predication saliency operator 1)
//# Takes in a hash of relations and the average activation weight of predications.
//# Returns a hash of predications saliencies. Keys are predications, value is {0,1} for
//# salient and non-salient predications respectively.
//#######################################################################################
/////////////////////////////////////////////////////////////////////////////////////////
function computeSRC1(count){

	// calculate averageActivationWeight
	var total = 0;
	
	for (var i = 0; i < count.length; i++) { total += count[i].balancedCount; }
	
	if (count.length == 0) averageActivationWeight = -1;
	else averageActivationWeight = total/count.length;
	
	// set SRC1 value for each predication
	for (var j = 0; j < count.length; j++) {
	
	if (count[j].balancedCount > averageActivationWeight)
			count[j].SRC1 = true;
		else 
			count[j].SRC1 = false;
  }
}

///////////////////////////////////////////////////////////////////////////////////
//function findDominant(predicate)
//
//compares incoming predicate to dominant preds in current summarization structure.
//returns the index of the predicate if found or -1 if not found.
///////////////////////////////////////////////////////////////////////////////////
function findDominant(predicate) {

	for (var i = 0; i < selection.summarization.dominantPreds.length; i++) {
		if (selection.summarization.dominantPreds[i] == predicate) return i;
	}
	return -1;
}