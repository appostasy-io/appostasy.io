

function setup() {
	console.info("entered setup()");
	
	var el = document.getElementById("particles");
	el.style.animationDelay = -300 * (Math.random() % 10000) / 10000;
	
	var num_particles = 75;

	var yzamplmin = 0.1;
	var yzamplmax = 0.8;
	var xperiodmax = 100.0;
	var xperiodmin = 300.0;
	var yperiodmax = 100.0;
	var yperiodmin = 50.0;

	var z_scale = 3;
	var mid_r = 25;
	var near_r = mid_r * z_scale;
	var far_r = mid_r / z_scale;
	var near_l = 25;
	var mid_l = 75;
	var far_l = 50	;

	var particles = [];

	var getUnique = (function() {
		var nextUnique = performance.now();
		function _getUnique() {
			nextUnique = nextUnique + 1;
			return nextUnique;
		}
		return _getUnique;
	})();

	function padNumToStr(n, places) {
		var s = String(Number(n))
			.split(".")
			.join("");
		s = s.substr(s.length - places);
		return s.padStart(places, "0");
	}

	function addStyleRule(ruletext) {
		if (document.styleSheets.length < 1) {
			var sheetel = document.createElement("style");
			document.head.appendChild(sheetel);
		}
		var sheet = document.styleSheets[document.styleSheets.length - 1];
		return sheet.insertRule(ruletext, sheet.cssRules.length);
	}

	function createSVGNode(n, v, camel) {
		if (camel == undefined) {
			camel = false;
		}
		var node = document.createElementNS("http://www.w3.org/2000/svg", n);
		for (var p in v) {
			var a = p;
			if (!camel) {
				a = p.replace(/[A-Z]/g, function(m, p, o, s) {
					return "-" + m.toLowerCase();
				});
			}
			node.setAttributeNS(null, a, v[p]);
		}
		return node;
	}

	function addparticle(xperiod, yperiod, xphase, yphase, yzampl) {
		console.debug(
			"addparticle(" + [xperiod, yperiod, xphase, yphase, yzampl].join(", ") + ")"
		);
		/*
  We want to animate three transformations independently, so we need two wrapper g elements around our  
  actual particle's path element, one to animate the x translation, one for the y translation animation,
  and theq scaling animation we can apply to the path element itself.
  */

		var txgroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		txgroup.appendChild(
			createSVGNode(
				"animateTransform",
				{
					attributeName: "transform",
					type: "translate",
					from: "-10 0",
					to: "1010 0",
					begin: -xperiod * xphase + "s",
					dur: xperiod + "s",
					repeatCount: "indefinite",
					keyTimes: "0; 1"
				},
				true
			)
		);

		var tygroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		tygroup.appendChild(
			createSVGNode(
				"animateTransform",
				{
					attributeName: "transform",
					type: "translate",
					values:
						"0 " +
						(250 - 250 * yzampl) +
						"; 0 " +
						(250 + 250 * yzampl) +
						"; 0 " +
						(250 - 250 * yzampl) +
						"",
					begin: -yperiod * yphase + "s",
					dur: yperiod + "s",
					repeatCount: "indefinite",
					keySplines: "0.5 0 0.5 1; 0.5 0 0.5 1",
					keyTimes: "0; 0.5; 1",
					calcMode: "spline"
				},
				true
			)
		);

		var tzgroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
		tzgroup.appendChild(
			createSVGNode(
				"animateTransform",
				{
					attributeName: "transform",
					type: "scale",
					values:
						"" +
						mid_r / (1.0 + (z_scale - 1.0) * yzampl) +
						"; " +
						mid_r * (1.0 + (z_scale - 1.0) * yzampl) +
						"; " +
						mid_r / (1.0 + (z_scale - 1.0) * yzampl),
					begin: -(yperiod / 4 + yperiod * yphase) + "s",
					dur: yperiod + "s",
					repeatCount: "indefinite",
					keySplines: "0.5 0 0.5 1; 0.5 0 0.5 1",
					keyTimes: "0; 0.5; 1",
					calcMode: "spline"
				},
				true
			)
		);

		var particle = createSVGNode("path", {
			fill: "#fff",
			fillOpacity: 2.0 / 5.0,
			strokeOpacity: 5.0 / 6.0,
			strokeWidth: 0.05,
			stroke: "#fff",
			d: "M 0,-0.5 0.433012,-0.25 V 0.25 L 0,0.5 -0.433012,0.25 v -0.5 z"
		});

		txgroup.appendChild(tygroup);
		tygroup.appendChild(tzgroup);
		tzgroup.appendChild(particle);
		particles[particles.length] = txgroup;
		particle.classList.add("particle");
		document.getElementById("particles").appendChild(txgroup);
	}

	function randrange(lo, hi) {
		return lo + Math.random() * (hi - lo);
	}

	for (var i = 0; i < num_particles; i++) {
		addparticle(
			randrange(xperiodmin, xperiodmax),
			randrange(yperiodmin, yperiodmax),
			randrange(0, 1),
			randrange(0, 1),
			randrange(yzamplmin, yzamplmax)
		);
	}
}

setup();

document.addEventListener("load", function(){
	
});
