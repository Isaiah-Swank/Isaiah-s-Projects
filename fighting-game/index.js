const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5

const background = new Sprite( 
    {
        position: 
        {
            x: 0,
            y: 0
        },
        imageSrc: './img/background.png'
    }
)

const shelf = new Sprite( 
    {
        position: 
        {
            x: 120,
            y: 125
        },
        imageSrc: './img/shelf.png',
        scale: 3.25,
        framesMax: 4
    }
)


const player = new Fighter({
    position: 
    {
        x:0,
        y:0
    },
    velocity: 
    {
        x:0,
        y:10
    },
    imageSrc: './img/Mason-idle.png',
    framesMax: 5,
    scale: 4,
    offset:
    {
        x: 25,
        y: 180
    },
    sprites: 
    {
        idle:
        {
            imageSrc: './img/Mason-idle.png',
            framesMax: 5
        },
        run:
        {
            imageSrc: './img/Mason-idle.png',
            framesMax: 5
        },
        jump:
        {
            imageSrc: './img/Mason-jumping.png',
            framesMax: 4
        },
        attack:
        {
            imageSrc: './img/Mason-attack.png',
            framesMax: 5
        }

    },
    attackBox: 
    {
        offset:
        {
            x: 70,
            y: -20,
        },
        width: 100,
        height: 50
    }
})

const enemy = new Fighter({
    position: 
    {
        x:600,
        y:100
    },
    velocity: 
    {
        x:0,
        y:10
    },
    color: 'red',
    imageSrc: './img/kenadee-idle.png',
    framesMax: 4,
    scale: 4,
    offset:
    {
        x: 25,
        y: 190
    },
    sprites: 
    {
        idle:
        {
            imageSrc: './img/kenadee-idle.png',
            framesMax: 4
        },
        run:
        {
            imageSrc: './img/kenadee-idle.png',
            framesMax: 4
        },
        jump:
        {
            imageSrc: './img/kenadee-jumping.png',
            framesMax: 3
        },
        attack:
        {
            imageSrc: './img/kenadee-attack.png',
            framesMax: 3.25
        }

    },
    attackBox: 
    {
        offset:
        {
            x: -40,
            y: -20,
        },
        width: 90,
        height: 60
    }
})
console.log(player)

const keys = {
    a: 
    {
       pressed: false 
    },
    d: 
    {
        pressed: false 
    },
    w:
    {
        pressed: false
    },
    j:
    {
        pressed: false
    },
    l:
    {
        pressed: false
    },
    i:
    {
        pressed: false
    }

}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shelf.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

     // player movement
    if (keys.a.pressed && player.lastKey == 'a') 
    {
        player.velocity.x = -5
        player.switchSprites('run')
    }
    else if(keys.d.pressed && player.lastKey == 'd')
    {
        player.velocity.x = 5
        player.switchSprites('run')
    }
    else
    {
        player.switchSprites('idle')
    }

    if(player.velocity.y < 0 )
    {
        player.switchSprites('jump')
    }

    // enemy movement
    if (keys.j.pressed && enemy.lastKey == 'j') 
    {
        enemy.velocity.x = -5
        player.switchSprites('run')
    }
    else if(keys.l.pressed && enemy.lastKey == 'l')
    {
        enemy.velocity.x = 5
        player.switchSprites('run')
    }
    else
    {
        player.switchSprites('idle')
    }
    if(enemy.velocity.y < 0 )
    {
        enemy.switchSprites('jump')
    }
    else if( enemy.velocity.y > 0)
    {
        enemy.switchSprites('idle')
    }

    // detect for collision
    if ( rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking ) 
    {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if ( rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking ) 
    {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end the game if all health is lost
    if( player.health <= 0 || enemy.health == 0) 
    {
        determineWinner({player,enemy, timerId})
    }
}

// call the animation loop function
animate()


window.addEventListener('keydown', (event) => {
    switch (event.key)
    {
        // player keys
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
        break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
        break
        case 'w':
            player.velocity.y =-10
        break
        case 's':
            player.attack()
        break

        // enemy keys
        case 'l':
            keys.l.pressed = true
            enemy.lastKey = 'l'
        break
        case 'j':
            keys.j.pressed = true
            enemy.lastKey = 'j'
        break
        case 'i':
            enemy.velocity.y =-10
        break
        case 'k':
            enemy.attack()
            enemy.switchSprites('idle')
        break
    }
})

window.addEventListener('keyup', (event) => {

    // player keys
    switch (event.key)
    {
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 'w':
            keys.w.pressed = false
        break
    }

    // enemy keys
    switch (event.key)
    {
        case 'l':
            keys.l.pressed = false
        break
        case 'j':
            keys.j.pressed = false
        break
        case 'i':
            keys.i.pressed = false
        break
    }
    console.log(event.key)
})