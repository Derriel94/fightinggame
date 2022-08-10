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
	 offset: {
    x: 0,
    y: 0
  },
   imageSrc: './imgs/samuraiMack/Idle.png',
  framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
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
	},
	attackBox: {
		offset: {
			x: 75,
			y: 50
		},
		width: 190,
		height: 50
	}
});

const enemy = new Fighter({
	position: {
		x: 960,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: -50,
		y: 0
	},
	imageSrc: './imgs/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167
  },
	sprites: {
		idle: {
			imageSrc:`./imgs/kenji/Idle.png`,
			framesMax: 4
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
			framesMax: 4
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
			framesMax: 7
		},
		takeHit: {
			imageSrc:`./imgs/kenji/Take Hit.png`,
			framesMax: 3
		}
	},
	attackBox: {
		offset: {
			x: -170,
			y: 50
		},
		width: 150,
		height: 50
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
	c.fillStyle = 'rgba(255, 255, 255, 0.1)'
	c.fillRect(0,0, canvas.width, canvas.height)
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	//player movment
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -7
		player.switchSprite('run')
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 7
		player.switchSprite('run')
	} else {		
		player.switchSprite('idle')
	}
	//jump and falling
	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	//enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -8
		enemy.switchSprite('run')
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 8
		enemy.switchSprite('run')
	} else {		
		enemy.switchSprite('idle')
	}
	//jump and falling
	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}

	//detect collision & enemy gets hit
	if ( rectangularCollision({
		rectangle1: player,
		rectangle2: enemy
	}) &&
		player.isAttacking && player.framesCurrent === 4
		) {
		enemy.takeHit()
		player.isAttacking = false
		gsap.to('#enemy-health', {
			width: enemy.health + '%'
		})
	}
		//if player misses 
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false
	}
	//detect collision &  player gets hit
	if ( rectangularCollision({
		rectangle1: enemy,
		rectangle2: player
	}) &&
		enemy.isAttacking && player.framesCurrent === 2
		) {
		player.takeHit()
		enemy.isAttacking = false
		// document.querySelector('#player-health').style.width = player.health + '%';
		gsap.to('#player-health', {
			width: player.health + '%'
		})
	}

	//if enemy misses
	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false
	}

	//end game based on health
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId})
	}
}

animate();

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
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
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
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
      case 'ArrowDown':
        enemy.attack()

        break
    }
  }
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
	
})
