import utils from './utils';
import { Circ } from 'gsap';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: 10,
  y: 10
};

const colors = ['#FD4A4C', '#0098db', '#E5E4DB', '#2d2d2d'];

// Event Listeners
addEventListener('mousemove', event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Objects
function Particle(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.velocity = {
    x: Math.random() - 0.5 * 4,
    y: Math.random() - 0.5 * 4
  };
  this.radius = radius;
  this.color = color;
  this.mass = 1;
  this.opacity = 0;
}

Particle.prototype.update = function(particles) {
  this.draw();

  for (let i = 0; i < particles.length; i++) {
    if (this === particles[i]) continue;
    if (
      getDistance(this.x, this.y, particles[i].x, particles[i].y) -
        this.radius * 2 <
      0
    ) {
      utils.resolveCollision(this, particles[i]);
    }
  }

  if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
    this.velocity.x = -this.velocity.x;
  }

  if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
    this.velocity.y = -this.velocity.y;
  }

  if (
    getDistance(mouse.x, mouse.y, this.x, this.y) < 80 &&
    this.opacity < 0.2
  ) {
    this.opacity += 0.02;
  } else if (this.opacity > 0) {
    this.opacity -= 0.02;
    this.opacity = Math.max(0, this.opacity);
  }

  this.x += this.velocity.x;
  this.y += this.velocity.y;
};

Particle.prototype.draw = function() {
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.save();
  c.globalAlpha = this.opacity;
  c.fillStyle = this.color;
  c.fill();
  c.restore();
  c.strokeStyle = this.color;
  c.stroke();
  c.closePath();
};

// Implementation
let particles;

function init() {
  particles = [];

  for (let i = 0; i < 275; i++) {
    let x = utils.randomIntFromRange(radius, canvas.width - radius);
    let y = utils.randomIntFromRange(radius, canvas.height - radius);
    const radius = 20;
    const color = utils.randomColor(colors);

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          getDistance(x, y, particles[j].x, particles[j].y) - radius * 2 <
          0
        ) {
          x = utils.randomIntFromRange(radius, canvas.width - radius);
          y = utils.randomIntFromRange(radius, canvas.height - radius);
          j = -1;
        }
      }
    }

    particles.push(new Particle(x, y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  // if (
  //   getDistance(particle1.x, particle1.y, particle2.x, particle2.y) <
  //   particle1.radius + particle2.radius
  // ) {
  //   particle1.color = 'red';
  // } else {
  //   particle1.color = 'black';
  // }

  particles.forEach(particle => {
    particle.update(particles);
  });
}

init();
animate();
