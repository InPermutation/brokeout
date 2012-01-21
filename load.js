// #board is the board

var running = false;
jQuery(function($){
		var boardWidth = 800;
		var boardHeight = 600;
		var paddleWidth = 80;
		var paddleHeight = 10;
		var ballWidth = paddleHeight;
		var ballHeight = paddleHeight;
		var brickWidth = 90;
		var brickHeight = paddleHeight;
		var brickOffset = 9;

		var init=function(){
			var board = $("#board")
				.empty()
				.width(boardWidth)
				.height(boardHeight)
				.append('<div id="paddle"></div>')
				.append('<div id="ball"></div>')
				.css('position','relative');

			var paddle = $("#paddle")
				.width(paddleWidth)
				.height(paddleHeight)
				.css('position','absolute')
				.css('top','550px')
				.css('left', (boardWidth-paddleWidth)/2 + 'px');



			var ball = $("#ball")
				.height(ballHeight)
				.width(ballWidth)
				.css('position', 'absolute')
				.css('top', (parseInt(paddle.css('top')) - 2*ballHeight) + 'px')
				.css('left', (boardWidth-ballWidth)/2 + 'px')
				.data('velocity', {x: -4, y: 4});
			for(var row=0; row < 3; row++)
			for(var col=0; col < 8; col++)
			{
				var stagger = (row%2==1)? brickWidth/2:0;
				if(stagger>0 && col == 7) continue;
				var brick = $('<div class="brick"></div>')
						.height(brickHeight)
						.width(brickWidth)
						.css('position','absolute')
						.css('top', brickOffset + row*(brickHeight + brickOffset) + 'px')
						.css('left', stagger+brickOffset+col*(brickWidth + brickOffset) + 'px')
				board.append(brick);
			}
		};
		var die = function(){
			running = false;
			$("#ball").remove();
		};
		$("#board").click(function(ev){
			if(running) return;
				running = true;
				init();
			});
		$("#board").mousemove(function(ev){
			var board = $("#board");
			var paddle =$("#paddle");
			var x= ev.pageX - board.offset().left;
			x = Math.min(boardWidth - paddleWidth, x)
			paddle.css('left', x+'px');
		});

		var collides = function(ball){
			var off = ball.offset();
			var i_x = [off.left, off.left + ball.outerWidth()];
			var i_y = [off.top, off.top + ball.outerHeight()];
			return function(ix){
				var $this = $(this);
				var off = $this.offset();
				var t_x = [off.left, off.left + $this.outerWidth()];
				var t_y = [off.top, off.top + $this.outerHeight()];

				var collides= ( t_x[0] < i_x[1] && t_x[1] > i_x[0] &&
					t_y[0] < i_y[1] && t_y[1] > i_y[0]) ;

				return collides;
			};
		}

		var tick = function(){
			if(!running)return;
			var ball = $("#ball");
			if(ball.length!=1) return;
			var p = ball.position();
			var v = ball.data('velocity');
			p.left += v.x;
			p.top += v.y;

			if(p.top < 1) { p.top = 1; v.y = -v.y; }
			if(p.left < 1) { p.left = 1; v.x = -v.x; }
			if(p.left > boardWidth - ballWidth) { p.left = boardWidth - ballWidth; v.x = -v.x; }
			$("#paddle").filter(collides(ball)).each(function(){
					var $this = $(this);
					var paddlePos = $this.position();
					p.top = paddlePos.top - ball.outerHeight();

					var speed = Math.sqrt(v.x*v.x + v.y*v.y);

					var radius = paddleWidth/2;
					var middle = paddlePos.left + radius;
					var off = p.left + ballWidth/2 - middle;
					if(off>0 && off>radius) off= radius;
					if(off<0 & off<-radius) off=-radius;

					var fR = radius * 1.1;

					v.x = off/fR * speed;
					// speed^ = v.x^ + v.y^
					// speed^ - v.x^ = v.y^
					// sq( ^^ ) = v.y
					v.y = -Math.sqrt(speed*speed - v.x*v.x);
					console.log(speed, Math.sqrt(v.x*v.x + v.y*v.y));
					});
			$(".brick").filter(collides(ball)).each(function(){
					$(this).remove();
				       });

			ball.css('left', p.left+'px').css('top', p.top+'px');
			if(p.top > boardHeight){ alert('You lose!'); die(); }
			if($(".brick").length <= 0){ alert('You win!'); die(); }
		};

		init();
		$("#board")
			.append($("<div>Click to start</div>")
			.css('position','relative')
			.css('top', boardHeight/2+'px')
			.css('left', boardWidth/2 - 50+'px'));

		setInterval(tick, 30);// a little over 30fps
});
