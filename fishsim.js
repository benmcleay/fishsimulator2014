FS = {
	RNDBTW: function (min, max) {
		var range = max - min + 1;
		
		return Math.floor(Math.random() * range) + min;
		
	},
	
	PAD: function (n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	},

	DIRECTIONS: ['left', 'right', 'up', 'down'],
	
	GET_DIR: function () {
		return FS.DIRECTIONS[FS.RNDBTW(0, 3)];
	},
	
	PIXEL_UNIT: 25,
	
	SCORE: 0,

	ScreenManager: {
		
		Evaluate: function () {
			
			var height = $(window).height(),
				width = $(window).width(),
				area = height * width,
				pixelUnit = Math.sqrt(area / 150);
			
			var bodyWidth = width - (width % pixelUnit),
				bodyHeight = height - (height % pixelUnit);
				
			$('body')
				.width(bodyWidth)
				.height(bodyHeight)
				.css({
					'margin-top': (height % pixelUnit) / 2,
					'margin-bottom': (height % pixelUnit) / 2,
					'margin-left': (width % pixelUnit) / 2,
					'margin-right': (width % pixelUnit) / 2
				});
			
			FS.PIXEL_UNIT = pixelUnit;
			FS.ZERO = [(width % pixelUnit) / 2, (height % pixelUnit) / 2];
		}
		
	},
	
	BuildFish: function () {
		
		return $fish = $('<div />', {
			id: 'fish'
		});
		
	},
	
	InsertFish: function () {
		
		if (!this.fish) {
			this.fish = FS.BuildFish();
			
			$('html').append(this.fish);
		};
		
		this.fish.offset({ 
			top: FS.ZERO[1] + FS.PIXEL_UNIT, 
			left: FS.ZERO[0] + FS.PIXEL_UNIT });
		
	},
	
	MoveFish: function (dir) {
		
		var propertyName = 'margin';
		var change ='';
		
		if (!FS.Check(dir)) return;
		
		switch(dir) {
			case 'up':
				propertyName += 'Top';
				change = '-=';
				break;
			case 'down':
				propertyName += 'Top';
				change = '+=';
				break;
			case 'right':
				propertyName += 'Left';
				change = '+=';
				break;
			case 'left':
				propertyName += 'Left';
				change = '-=';
				break;
		}
		
		if (this.fish) {
			
			var configObj = {};
			
			configObj[propertyName] = "" + change + FS.PIXEL_UNIT + "px";
			
			this.fish.animate(configObj, 800);
			
			this.UpdateScore();
		};
		
	},
	
	Check: function (dir) {
		
		if (this.fish) {
			
			var offset = this.fish.offset(),
			top = offset.top,
			left = offset.left;
			
			var buffer = FS.PIXEL_UNIT * 2;
			
			switch(dir) {
				case 'up':
					return (top - buffer) > 0;
				case 'down':
					return (top + buffer) < $(window).height();
				case 'left':
					return left - buffer > 0;
				case 'right':
					return (left + buffer) < $(window).width();
			}
		}
	},
	
	Think: function () {
		
		if (!this.fish) return;
		
		var seed = FS.RNDBTW(1, 150);
		
		switch (true) {
			case seed < 25: // talk
			
				FS.Bubble();
				break;
			case seed < 50: // move
			
				FS.MoveFish(FS.GET_DIR());
			
				break;
		}
		
	},
	
	Talk: function () {
		
		if (!this.fish) return;
		
		var $talkbar = $('.thoughts');
		
		var dialog = '"' + FS.THOUGHTS[FS.RNDBTW(0, FS.THOUGHTS.length - 1)] + '"';
		
		$talkbar.html(dialog);
		
		setTimeout(function () {
			$talkbar.html("");
		}, 3000);
		
	},

	UpdateScore: function () {

		if (!this.fish) return;

		FS.SCORE++;

		var text = "SCORE: ";

		text += FS.PAD(FS.SCORE, 10);

		$('.thoughts').html(text);

	},

	Bubble: function () {

		if (!this.fish) return;

		if ($('.bubble').length > 0) return;

		var $bubble = $('<div />', {
				class: 'bubble'
			});

		var fishPos = this.fish.offset(),
			fish_x = fishPos.left + 117,
			fish_y = fishPos.top + 20;

		$('html').append($bubble);

		$bubble.offset({
			top: fish_y,
			left: fish_x
		}).animate({
			marginTop: "-=2000"
		}, {
			complete: function () {
				$bubble.remove();
			},

			duration: 20000
		});

		this.UpdateScore();

	},
	
	THOUGHTS: [
		"this is lame as hell",
		"being a fish is bullshit",
		"shit man nothin ever fuckin happens in here",
		"fuckin wish i could go online",
		"fuck",
		"kill me",
		"oh for fuck's sake",
		"yep",
		"fuck off",
		"this is some fresh bullshit",
		"the fuck are you looking at dickhead",
		"it's really wet in here",
		"i dreamt i killed a man again",
		"i'm so lonely",
		"sup man",
		"i just pissed"
	]
	
};

$(window).resize(function () {
	FS.ScreenManager.Evaluate();
	
	FS.InsertFish();

	FS.UpdateScore();
});

$(function () {
	$(window).resize();
	
	$('.title').blink();
	
	setInterval(FS.Think, 1500);
});
