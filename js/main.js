// More info about config & dependencies:
// - https://github.com/hakimel/reveal.js#configuration
// - https://github.com/hakimel/reveal.js#dependencies

var backcolors = ['red', 'green', 'blue', 'orange', 'yellow'];
var sections ='';
		
		for(i = 1; i < 87; i++){
			//console.log(i);
			sections += '<section data-menu-title="slide'+i+'" data-background="assets/week9assets/localstorage_rest'+i+'.png" data-background-size="950px" data-background-color="#212121"></section>'
		}


$(document).ready(function () {
	console.log('ready',sections);
	/*$('section').each(function(){
		if(!$(this).hasClass('code')){
			var ran= backcolors[Math.floor((Math.random() * 4) + 1)];
			console.log('section found', ran);
       $(this).data('background',ran );
		
	}
    });*/
	

		
});



Reveal.initialize({
	controls: true,
	progress: true,
	history: true,
	center: true,
	width: '80%',
	height: '100%',

	transition: 'concave', // none/fade/slide/convex/concave/zoom
	dependencies: [{
			src: 'lib/js/classList.js',
			condition: function () {
				return !document.body.classList;
			}
		}, {
			src: 'plugin/markdown/marked.js',
			condition: function () {
				return !!document.querySelector('[data-markdown]');
			}
		}, {
			src: 'plugin/markdown/markdown.js',
			condition: function () {
				return !!document.querySelector('[data-markdown]');
			}
		}, {
			src: 'plugin/highlight/highlight.js',
			async: true,
			callback: function () {
				hljs.initHighlightingOnLoad();
			}
		}, {
			src: 'plugin/zoom-js/zoom.js',
			async: true
		}, {
			src: 'plugin/notes/notes.js',
			async: true
		},
		{
			src: 'plugin/live-coding/live-coding.js',
			async: true,
			condition: function () {
				return !!document.body.classList;
			}
		}, 
		{
			src: 'plugin/menu/menu.js'
		}


	],

	menu: {
		// Specifies which side of the presentation the menu will 
		// be shown. Use 'left' or 'right'.
		side: 'left',
		transitions: false,
		themes: false,
		slides: false
	}
});

Reveal.addEventListener( 'ready', function( event ) {
	console.log('reveal loaded');
} );

Reveal.addEventListener('jsexample1', function () {
	console.log('jsexample1 called!');
	$( "#jsexample1 #mybtn").unbind( "click" );
	$("#jsexample1 #mybtn").click(changeHeading);
       
function changeHeading() {
var ex1 = $("#jsexample1 #myheading");
var newHead= prompt("enter new header");
ex1.text(newHead);
}
	
});


var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	});
}


Reveal.addEventListener('pie', function () {
Highcharts.chart('assessmentcontainer', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Assessment weighting'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'types',
        colorByPoint: true,
        data: [{
            name: 'Concept and design  (15%)',
            y: 15
        }, {
            name: 'Prototyping (30%)',
            y: 30
        },
			   {
            name: 'Final App (50%)',
            y: 50
        },
			   {
            name: 'Reflection (5%)',
            y: 5,
            sliced: true,
            selected: true
        }]
    }]
});
	
});

Reveal.addEventListener('npmstats', function () {
	console.log('stats');
	Highcharts.chart('npmstatscontainer', {

		chart: {
			type: 'column'
		},
		title: {
			text: 'cordova'
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {
			title: {
				text: 'Downloads'
			}

		},
		legend: {
			enabled: false
		},
		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					format: '{point.y:.1f}k'
				}
			}
		},
		credits: {
			enabled: false
		},

		tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
		},

		series: [{
			name: 'Stats',
			colorByPoint: true,
			data: [{
				name: 'downloads in the last day',
				y: 27887
			}, {
				name: 'downloads in the last week',
				y: 222226
			}, {
				name: 'downloads in the last month',
				y: 1001952
			}]
		}]
	});

	
});




