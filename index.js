const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);


const gravity = 0.7;
const layer1 = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './imgs/parallax_forest_pack/layers/1.png',
	framesMax: 1
});
const layer2 = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './imgs/parallax_forest_pack/layers/2.png',
	framesMax: 1
});
const layer3 = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './imgs/parallax_forest_pack/layers/4.png',
	framesMax: 1
});
const layer4 = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './imgs/parallax_forest_pack/layers/3.png',
	framesMax: 1
});

const player = new Fighter({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: `./imgs/samuraiMack/idle.png`,
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 157,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc:`./imgs/samuraiMack/Idle.png`,
			framesMax: 8
		},
		run: {
			imageSrc:`./imgs/samuraiMack/Run.png`,
			framesMax: 8
		},
		jump: {
			imageSrc:`./imgs/samuraiMack/Jump.png`,
			framesMax: 2
		},
		attack1: {
			imageSrc:`./imgs/samuraiMack/Attack1.png`,
			framesMax: 6
		},
		attack2: {
			imageSrc:`./imgs/samuraiMack/Attack2.png`,
			framesMax: 6
		},
		fall: {
			imageSrc:`./imgs/samuraiMack/Fall.png`,
			framesMax: 2
		},
		death: {
			imageSrc:`./imgs/samuraiMack/Death.png`,
			framesMax: 6
		},
		takeHit: {
			imageSrc:`./imgs/samuraiMack/Take Hit.png`,
			framesMax: 4
		}
	}
});

const enemy = new Fighter({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: `./imgs/kenji/Idle.png`,
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: -288,
		y: 172
	},
	sprites: {
		idle: {
			imageSrc:`./imgs/kenji/Idle.png`,
			framesMax: 8
		},
		run: {
			imageSrc:`./imgs/kenji/Run.png`,
			framesMax: 8
		},
		jump: {
			imageSrc:`./imgs/kenji/Jump.png`,
			framesMax: 2
		},
		attack1: {
			imageSrc:`./imgs/kenji/Attack1.png`,
			framesMax: 6
		},
		attack2: {
			imageSrc:`./imgs/kenji/Attack2.png`,
			framesMax: 6
		},
		fall: {
			imageSrc:`./imgs/kenji/Fall.png`,
			framesMax: 2
		},
		death: {
			imageSrc:`./imgs/kenji/Death.png`,
			framesMax: 6
		},
		takeHit: {
			imageSrc:`./imgs/kenji/Take Hit.png`,
			framesMax: 4
		}
	}
	
});

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	}
}

function rectangularCollision({ rectangle1, rectangle2}) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
		rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
		);
}

function determineWinner({player, enemy, timerId}) {
	clearTimeout(timerId);
	document.querySelector('#display-text').style.display = 'flex';
	if (player.health === enemy.health) {
			document.querySelector('#display-text').innerHTML = 'TIE!'	
		} else if (player.health > enemy.health) {
			document.querySelector('#display-text').innerHTML = 'Player 1 Wins!'
		} else if (player.health < enemy.health) {
			document.querySelector('#display-text').innerHTML = 'Player 2 Wins!'
		} 
}

let timer = 60
let timerId
function decreaseTimer() {
	timerId = setTimeout(decreaseTimer, 1000)
	if (timer > 0) {
		timer--
		document.querySelector('#timer').innerHTML = timer;
	}
	if (timer === 0){
		determineWinner({player, enemy});
	}

}

decreaseTimer()
function animate() {
	window.requestAnimationFrame(animate);
	// c.fillStyle = 'black';
	c.fillRect(0,0, canvas.width, canvas.height);
	layer1.update();
	layer2.update();
	layer3.update();
	layer4.update();
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	//player movment
	player.image = player.sprites.idle.image
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5
		player.image = player.sprites.run.image
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
		player.image = player.sprites.run.image
	}
	if (player.velocity.y < 0) {
		player.image = player.sprites.jump.image
		player.framesMax = player.sprites.jump.framesMax
	}

	//enemy movement
	enemy.image = enemy.sprites.idle.image
		if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -10
		enemy.image = enemy.sprites.run.image
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 10
		enemy.image = enemy.sprites.run.image
	}
	if (enemy.velocity.y < 0) {
		enemy.image = enemy.sprites.jump.image
		enemy.framesMax = enemy.sprites.jump.framesMax
	}

	//detect collision
	if ( rectangularCollision({
		rectangle1: player,
		rectangle2: enemy
	}) &&
		player.isAttacking
		) {
		player.isAttacking = false
		enemy.health -= 20;
		document.querySelector('#enemy-health').style.width = enemy.health + '%';
	}

	if ( rectangularCollision({
		rectangle1: enemy,
		rectangle2: player
	}) &&
		enemy.isAttacking
		) {
		enemy.isAttacking = false
		player.health -= 20;
		document.querySelector('#player-health').style.width = player.health + '%';
	}

	//end game based on health
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId})
	}
}

animate();

window.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'd':
		keys.d.pressed = true
		player.lastKey = 'd'
		break
		case 'a':
		keys.a.pressed = true
		player.lastKey = 'a'
		break
		case 'w':
		player.velocity.y = -20
		break
		case ' ':
		player.attack()
		break
		case 'ArrowRight':
		keys.ArrowRight.pressed = true
		enemy.lastKey = 'ArrowRight'
		break
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = true
		enemy.lastKey = 'ArrowLeft'
		break
		case 'ArrowUp':
		enemy.velocity.y = -20
		break
		case '0':
		enemy.attack()
		break
	}
	console.log(event.key)
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
		keys.d.pressed = false
		break
		case 'a':
		keys.a.pressed = false
		break
		case 'ArrowRight':
		keys.ArrowRight.pressed = false
		break
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = false
		break
	}
	console.log(event.key)
})
