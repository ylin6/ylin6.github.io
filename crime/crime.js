$(document).ready(function(){
	// Set Current Date
	var crimeTypes = ["Burglary", "Theft", "Criminal Damage", "Assault", "Battery", "Robbery", "Criminal Trespassing", "Sexual Assault", "Arson", "Sex Offense", "Kidnapping"];
	var currentTime = new Date();
	var day = ("0" + currentTime.getDate()).slice(-2);
	var month = ("0" + (currentTime.getMonth() + 1)).slice(-2);
	$('#date').val(currentTime.getFullYear() + "-" + month + "-" + day);

	// Set Current Time
	var hour = ("0" + currentTime.getHours()).slice(-2);
	var min = ("0" + currentTime.getMinutes()).slice(-2);
	$('#time').val(hour + ":" + min);

	// Naive Bayes Function
	var NaiveBayes = function(monthRate, commAreaRate, hourRate, crimeRate){
		return (monthRate * commAreaRate * hourRate * crimeRate);
	};

	// Gaussian Distribution 

	var Gaussian = function(mean, stdDev, x){
		var power = -(Math.pow((x-mean), 2)/(2*Math.pow(stdDev, 2)));
		return 1/(Math.sqrt(2*Math.PI*stdDev)) * Math.pow(Math.E, power);
	}

	// Sorted Array
	function getSortedKeys(obj) {
    	var keys = []; for(var key in obj) keys.push(key);
    	return keys.sort(function(a,b){return obj[b]-obj[a]});
	}

	// Mouse Over
	$("g").mouseenter(function(){
		var commArea = $(this).attr("id");
		var month = new Date(Date.parse($("#date").val())).getMonth() + 1;
		var hour = $("#time").val().slice(0, 2);
		var crimeProbability = {};

		for(i = 0; i < 11; i ++){
			var commAreaRate = model["Community Area"][commArea][i] / model["Community Area"]["total"][i];
			var monthRate = model["Month"][month][i] / model["Month"]["total"][i];
			var hourRate = Gaussian(model["Hour"]["mean"][i], model["Hour"]["std. dev"][i], parseFloat(hour));
			var crimeRate =  model["Crime"]["crime rate"][i];
			var crimeRateTotal = model["Crime"]["sum"];
			crimeProbability[crimeTypes[i]] = NaiveBayes(monthRate, commAreaRate, hourRate, crimeRate);
		}


		// Normalize Probabilities
		var normalizationSum = 0;
		for(key in crimeProbability){
			normalizationSum += crimeProbability[key];
		}

		for(key in crimeProbability){
			crimeProbability[key] = crimeProbability[key]/normalizationSum;
		}

		var sk = getSortedKeys(crimeProbability);

		$(".model").empty();

		for( var j = 0; j < 11; j++){
			var cp = crimeProbability[sk[j]] * 100;
			cp = cp.toFixed(2);
			$(".model").append("<div class=\"model-row\"> " + "<span class=\"crime-type\">" + sk[j] + " : " + "</span>" + "<span class=\"crime-probability\">" + cp + "% </span></div>");
		}


		// Parse CommArea for UI
		if(commArea != "O-Hare"){
			commArea = commArea.replace("-", " ");
		}

		else{
			commArea = commArea.replace("-", "\'");
		}

		$(".comm-area-title").empty();

		$(".comm-area-title").text(commArea);

		// D3
		$("#d3").empty();
		var width = 500;
		var height = 220;
		var radius = 130;

		var color = d3.scale.ordinal().range(["#1F3F75", "#051C43", "#0F2C5F", "#345389", "#45978C", "#288275", "#065A4E", "#003F37", "#156F62", "#0F5500", "#1B7808"]);

		var svg = d3.select("#d3")
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + (width/4) + ',' + (height/2) + ')');

		var arc = d3.svg.arc()
		.outerRadius(radius-20)
		.innerRadius(radius-40);

		var pie = d3.layout.pie()
		.sort(d3.ascending)
		.value(function(d){
			return d.value;
		});

		var path = svg.selectAll('path')
			.data(pie(d3.entries(crimeProbability)))
			.enter()
			.append('path')
			.attr('d', arc)
			.attr('fill', function(d, i){
				return color(d.data.value);
			});

		var legendRectSize = 13;
		var legendSpacing = 4;

		var legend = svg.selectAll('.legend')
			.data(d3.entries(crimeProbability))
			.enter()
			.append('g')
			.attr('class', 'legend')
			.attr('transform', function(d, i){
				var height = legendRectSize + legendSpacing;
				var offset = height * color.domain().length / 2;
				var hor = 10 * legendRectSize;
				var vert = i * height -offset;
				return 'translate(' + hor + ',' + vert + ')';
			});


		legend.append('rect')
			.attr('width', legendRectSize)
			.attr('height', legendRectSize)
			.style('fill', function(d, i){
				return color(i);
			})
			.style('stroke', function(d, i){
				return color(i);
			});

		legend.append('text')
  			.attr('x', legendRectSize + legendSpacing)
  			.attr('y', legendRectSize - legendSpacing)
  			.text(function(d) { return d.key});


	});
});