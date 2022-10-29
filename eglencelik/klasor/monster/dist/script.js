var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(600, 500); 
    frameRate(60);    
    smooth();

    {
        /**/// // Do not remove this line
        angleMode = "degrees";

        textAlign(CENTER, CENTER);
        textFont(createFont('monospace'));

        var game, player;
    } //Globals

    {
        //Key|Button stuff
        var clicked = false, hover = false;
        var keys = [];
        keyPressed = function(){ 
            keys[keyCode] = true; 
        };
        keyReleased = function(){ 
            keys[keyCode] = false; 
        };
        mouseClicked = function(){
            clicked = true;
        };
    } //Keys/Mouse

    {
        var Button = function(config) {
            this.x = config.x || 0;
            this.y = config.y || 0;
            this.width = config.width || 100;
            this.height = config.height || 100;
            this.content = config.content || "Home";
            this.page = config.page || "home";
            this.level = config.level || 0;
            this.textSize = config.textSize || this.width/4;

            //Normal
            this.borderColor = config.borderColor || color(130, 135, 135, 100);
            this.backColor = config.backColor || color(10, 10, 10, 200);
            this.contentColor = config.contentColor || color(222, 222, 222);
            //Hover
            this.borderColorHover = config.borderColorHover || color(130, 135, 135, 50);
            this.backColorHover = config.bakColorHover || color(29, 29, 29, 200);
            this.contentColorHover = config.contentColorHover || color(222, 222, 222, 200);
        };

        //Draw the button
        Button.prototype.draw = function() {
            strokeWeight(2);
            if(this.isMouseInside()) {
                hover = true;

                if(clicked) {
                    game.page = this.page;
                    if(this.page === "level") {
                        game.level = this.level;
                    }
                    game.reset();
                }

                fill(this.backColorHover);
                stroke(this.borderColor);
                rect(this.x, this.y, this.width, this.height, 8);

                fill(this.contentColorHover);
                textSize(this.textSize);
                textAlign(CENTER, CENTER);
                text(this.content, this.x + this.width/2, this.y + this.height/2);
            }
            else {
                fill(this.backColor);
                stroke(this.borderColor);
                rect(this.x, this.y, this.width, this.height, 8);

                fill(this.contentColor);
                textSize(this.textSize);
                textAlign(CENTER, CENTER);
                text(this.content, this.x + this.width/2, this.y + this.height/2);
            }
        };

        //Checks if the mouse it over the button
        Button.prototype.isMouseInside = function() {
            return  mouseX > this.x &&
                    mouseX < this.x + this.width &&
                    mouseY > this.y &&
                    mouseY < this.y + this.height;
        };

        //Handles the hover animation
        Button.prototype.hover = function(){
            if(this.isMouseInside())
            {
                fill(this.backColorHover);
                rect(this.x-5, this.y-5, this.width + 10, this.height + 10, 8);
            }
        };
    } //Buttons

    {
        //Coin object
        var Coin = function(x, y, w, h, timeToLive) {
            this.pos = new PVector(x, y);
            this.w = w || 5;
            this.h = h || 5;
            this.timeToLive = timeToLive || 200;
        };

        Coin.prototype.update = function() {
            this.timeToLive--;
        };

        //Bone Object - Inherits from Coin
        var Bone = function(x, y) {
            this.w = 15;
            this.h = 3;
            this.timeToLive = 200;
            Coin.call(this, x, y, this.w, this.h, this.timeToLive);
        };

        Bone.prototype = Object.create(Coin.prototype);

        Bone.prototype.display = function() {
            fill(200, 200, 200, 200);
            rect(this.pos.x, this.pos.y, this.w, this.h, 5);
            ellipse(this.pos.x, this.pos.y+this.h/2, 5, 6);
            ellipse(this.pos.x, this.pos.y-this.h/2, 6, 5);

            ellipse(this.pos.x + this.w, this.pos.y+this.h/2, 6, 5);
            ellipse(this.pos.x + this.w, this.pos.y-this.h/2, 5, 6);
        };

        Bone.prototype.run = function() {
            this.update();
            this.display();
        };
    } //Coins

    {
        //Ammo Object
        var Ammo = function(x, y) {
            this.pos = new PVector(x, y);
            this.w = 36;
            this.h = 30;
            this.timeToLive = 200;
        };

        Ammo.prototype.update = function() {
            this.pos.y = constrain(this.pos.y + 3, -50, 370);
            if(this.pos.y === 370) {
                this.timeToLive--;
            }
        };

        Ammo.prototype.display = function() {
            fill(84, 90, 100);
            fill(20, 19, 19);
            rect(this.pos.x, this.pos.y, this.w, this.h);
            fill(90, 95, 104);
            fill(28, 26, 26);
            rect(this.pos.x+this.w/2, this.pos.y, this.w/2, this.h);
            beginShape();
                vertex(this.pos.x, this.pos.y);
                vertex(this.pos.x-3, this.pos.y+8);
                vertex(this.pos.x+this.w+3, this.pos.y+8);
                vertex(this.pos.x+this.w, this.pos.y);
                vertex(this.pos.x, this.pos.y);
            endShape();
            noStroke();
            fill(30, 38, 52);
            fill(240);
            textSize(9);
            textAlign(CENTER, CENTER);
            text("AMMO", this.pos.x + this.w/2, this.pos.y + this.h/2);
        };

        Ammo.prototype.run = function() {
            this.update();
            this.display();
        };
    } //Ammo

    {
        var Cross = function(config) {
            this.pos = config.pos || new PVector(0, 0);
            this.scale = config.scale || new PVector(1, 1);
            this.angle = config.angle || 0;
            this.lightColor = color(92, 94, 92);
            this.darkColor = color(87, 89, 87);
        };

        Cross.prototype.display = function() {
            noStroke();
            fill(this.lightColor);
            pushMatrix();
                translate(this.pos.x, this.pos.y);
                scale(this.scale.x, this.scale.y);
                rotate(radians(this.angle));
                rect(-10, 0, 20, 100);
                rect(-30, 20, 60, 20);

                fill(this.darkColor);
                rect(0, 0, 10, 100);
                rect(0, 20, 30, 20);
            popMatrix();
        };
    } //Cross

    {
        var GraveStone = function(config) {
            this.pos = config.pos || new PVector(0, 0);
            this.scale = config.scale || new PVector(1, 1);
            this.angle = config.angle || 0;
            this.lightColor = color(132, 135, 132);
            this.darkColor = color(123, 128, 123);
        };

        GraveStone.prototype.display = function() {
            noStroke();
            fill(this.lightColor);
            pushMatrix();
                translate(this.pos.x, this.pos.y);
                scale(this.scale.x, this.scale.y);
                rotate(radians(this.angle));
                arc(0, 0, 150, 120, radians(181), radians(360));
                rect(-75, 0, 150, 100);

                fill(this.darkColor);
                arc(0, 0, 150, 120, radians(271), radians(360));
                rect(0, 0, 75, 100);

                textFont(createFont('monospace'));
                textSize(40);
                fill(59, 57, 57);
                textAlign(CENTER, CENTER);
                text("R.I.P", 0, 0);
            popMatrix();
        };
    } //Gravestone

    {
        //Spider Web Object
        var SpiderWeb = function(config) {
            this.pos = config.pos || new PVector(0, 0);
            this.scale = config.scale || new PVector(1, 1);
            this.webColor = color(255, 255, 255, 50);
        };

        SpiderWeb.prototype.display = function() {
            noFill();
            strokeWeight(2);
            stroke(this.webColor);

            pushMatrix();
            translate(this.pos.x, this.pos.y);
            scale(this.scale.x, this.scale.y);

            beginShape();
            vertex(320, 80);
            bezierVertex(280, 53, 270, 53, 220, 0);
            endShape();

            beginShape();
            vertex(320, 80);
            bezierVertex(320, 63, 300, 53, 290, 0);
            endShape();

            beginShape();
            vertex(320, 80);
            bezierVertex(330, 63, 320, 55, 350, 0);
            endShape();

            beginShape();
            vertex(320, 80);
            bezierVertex(340, 78, 345, 72, 400, 42);
            endShape();

            beginShape();
            vertex(320, 80);
            bezierVertex(345, 98, 355, 98, 400, 110);
            endShape();

            beginShape();
            vertex(320, 80);
            bezierVertex(335, 118, 345, 128, 400, 190);
            endShape();

            //first row
            beginShape();
            vertex(287, 58);
            bezierVertex(298, 56, 300, 56, 305, 46);
            endShape();
            beginShape();
            vertex(305, 46);
            bezierVertex(312, 56, 320, 56, 329, 50);
            endShape();
            beginShape();
            vertex(329, 50);
            bezierVertex(335, 66, 335, 66, 344, 73);
            endShape();
            beginShape();
            vertex(344, 73);
            bezierVertex(340, 76, 340, 80, 346, 95);
            endShape();
            beginShape();
            vertex(346, 95);
            bezierVertex(338, 104, 338, 97, 339, 116);
            endShape();

            //second row
            beginShape();
            vertex(260, 38);
            bezierVertex(280, 37, 285, 35, 296, 23);
            endShape();
            beginShape();
            vertex(296, 23);
            bezierVertex(310, 35, 320, 33, 338, 26);
            endShape();
            beginShape();
            vertex(338, 26);
            bezierVertex(340, 45, 350, 52, 368, 61);
            endShape();
            beginShape();
            vertex(368, 61);
            bezierVertex(355, 80, 360, 82, 371, 102);
            endShape();
            beginShape();
            vertex(371, 102);
            bezierVertex(355, 120, 360, 122, 357, 139);
            endShape();

            //third row
            beginShape();
            vertex(235, 16);
            bezierVertex(270, 17, 280, 15, 290, 0);
            endShape();
            beginShape();
            vertex(290, 0);
            bezierVertex(315, 17, 330, 15, 347, 5);
            endShape();
            beginShape();
            vertex(347, 5);
            bezierVertex(360, 37, 350, 35, 392, 47);
            endShape();
            beginShape();
            vertex(392, 47);
            bezierVertex(380, 67, 370, 90, 395, 108);
            endShape();
            beginShape();
            vertex(395, 108);
            bezierVertex(380, 117, 370, 140, 378, 165);
            endShape();

            //forth row
            beginShape();
            vertex(372, 0);
            bezierVertex(380, 27, 385, 25, 400, 26);
            endShape();
            beginShape();
            vertex(400, 137);
            bezierVertex(384, 163, 392, 175, 393, 182);
            endShape();

            popMatrix();
        };
    } //Spiderweb

    {
        var Tree = function(info) {
            this.x = info.x || width/2;
            this.y = info.y || height;
            this.length = info.length || 60;
            this.depth = info.depth || 4;
            this.weight = info.weight || 6;
            this.baseColor = info.baseColor || color(20);
        };

        Tree.prototype.branch = function(length, depth, weight) {
            strokeWeight(weight);
            stroke(this.baseColor);

            line(0, 0, 0, -length);
            translate(0, -length);

            if (depth > 0) {
                depth--;
                for(var i = 0; i < random(2, 4); i++) {
                    var dir = random() < 0.5 ? 1 : -1;
                    pushMatrix();
                        rotate(radians(random(10, 40) * dir));
                        this.branch(length * random(0.65, 0.75), depth, weight * 0.65);
                    popMatrix();
                }
            }
        };

        Tree.prototype.display = function() {
            pushMatrix();
            translate(this.x, this.y);
            this.branch(this.length, this.depth, this.weight);
            popMatrix();
        };
    } //Tree

    {
        //Enemy Object
        var Enemy = function(pos) {
            this.pos = pos || new PVector(0, 360); //default location is on the ground
            this.w = 40;
            this.h = 40;
            this.speed = 3;
            this.dir = random() < 0.5 ? 1 : -1;
            if(this.dir === 1) {
                this.pos.x = floor(random(-250, -50));
            }
            else {
                this.pos.x = floor(random(650, 850));
            }
        };

        //Zombie Object - Inherits from Enemy
        var Zombie = function(pos) {
            Enemy.call(this, pos);
            this.skinColor = random() < 0.5 ? color(60, 99, 36) : color(79, 53, 110);
            this.shirtColor = random() < 0.5 ? color(10, 10, 9) : color(18, 33, 38);
            this.hairColor = color(33, 30, 29);
        };

        Zombie.prototype = Object.create(Enemy.prototype);

        Zombie.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            if(this.dir === -1) {
                scale(-1, 1);
                translate(-this.w, 0);        
            }

            //back arm
            stroke(this.skinColor);
            strokeWeight(3);
            line(this.w, this.h/1.5, this.w+this.w/3, this.h/1.8);
            //fingers
            strokeWeight(2);
            line(this.w+this.w/3, this.h/1.8, this.w+this.w/2, this.h/1.4);
            line(this.w+this.w/3, this.h/1.8, this.w+this.w/2.5, this.h/1.3);
            line(this.w+this.w/3, this.h/1.8, this.w+this.w/3.5, this.h/1.3);
            //body
            noStroke();
            fill(this.skinColor);
            rect(0, 0, this.w, this.h, 3);
            //shirt
            fill(this.shirtColor);
            rect(0, this.h/2, this.w, this.h/2);
            //front arm
            stroke(this.skinColor);
            strokeWeight(3);
            line(this.w/2, this.h/1.5, this.w, this.h/1.4);
            //fingers
            strokeWeight(2);
            line(this.w, this.h/1.4, this.w+this.w/8, this.h/1.2);
            line(this.w, this.h/1.4, this.w+this.w/20, this.h/1.1);
            line(this.w, this.h/1.4, this.w-this.w/10, this.h/1.1);

            //hair
            stroke(this.hairColor);
            strokeWeight(4);
            line(2, 0, this.w-2, 0);
            //fill(68, 112, 53);
            noStroke();
            //eyes
            fill(251, 249, 166);
            ellipse(this.w/3 + 5, this.h/3.5, 10, 10);
            ellipse(this.w - this.w/3 + 5, this.h/3.5, 10, 10);
            fill(43, 40, 40);
            ellipse(this.w/3 + 7, this.h/3.1, 2, 2);
            ellipse(this.w - this.w/3 + 7, this.h/3.9, 2, 2);

            popMatrix();

            noStroke();
        };

        Zombie.prototype.update = function() {
            this.pos.x += this.speed * this.dir;

            if(random() < 0.005) {
                game.coins.push(new Bone(this.pos.x, 395));
            }
        };

        Zombie.prototype.run = function() {
            this.update();
            this.display();
        };

        //ZamikazeZombie - Inhertis from Zombie > Enemy
        var KamikazeZombie = function(pos) {
            Zombie.call(this);
            this.timeToFall = random(200, 500);
            this.pos = pos;
            this.dropSpeed = 7;
            this.isOnGround = false;
        };

        KamikazeZombie.prototype = Object.create(Zombie.prototype);

        KamikazeZombie.prototype.drop = function() {
            if(!this.isOnGround) {
                this.timeToFall--;

                if(this.timeToFall < 0) {
                    this.pos.y += this.dropSpeed;
                    if(this.pos.y >= 360) {
                        this.isOnGround = true;
                    }
                }
            }
            this.display();
        };

        //Spider Object - Inherits from Enemy
        var Spider = function(pos) {
            Enemy.call(this, pos);
            this.headColor = color(31, 29, 28);
            this.bodyColor = random() < 0.5 ? color(115, 60, 11) : color(3, 3, 3);
            this.eyeColor = color(180, 180, 180);
            this.legColor = color(8, 8, 8);
        };

        Spider.prototype = Object.create(Enemy.prototype);

        Spider.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            if(this.dir === -1) {
                scale(-1, 1);
                translate(-this.w, 0);        
            }

            //legs - eight of them :)
            strokeWeight(1);
            stroke(this.legColor);
            for(var i = 0; i < 4; i++) {
                //left leg
                line(0, this.h * 0.2 + this.h/7*i, -this.w/8, this.h * 0.2 + this.h/7*i);
                line(-this.w/8, this.h * 0.2 + this.h/7*i, -this.w/4, this.h * 0.5 + this.h/6*i);
                //right leg
                line(this.w, this.h * 0.2 + this.h/7*i, this.w + this.w/8, this.h * 0.2 + this.h/7*i);
                line(this.w + this.w/8, this.h * 0.2 + this.h/7*i, this.w + this.w/4, this.h * 0.5 + this.h/6*i);
            }

            //body
            noStroke();
            fill(this.headColor);
            rect(0, 0, this.w, this.h/2, 8, 8, 0, 0);
            fill(this.bodyColor);
            rect(0, this.h/2, this.w, this.h/2.5, 0, 0, 8, 8);

            //eyes - eight of them :)
            fill(this.eyeColor);
            for(var i = 1; i <= 4; i++) {
                ellipse(this.w/5 * i + this.speed/2, this.h/6, 3, 3);
                ellipse(this.w/5 * i + this.speed/2, this.h/2.7, 3, 3);
            }

            //fangs
            triangle(this.w * 0.4, this.h/2, this.w * 0.5, this.h * 0.75, this.w * 0.55, this.h/2);
            triangle(this.w * 0.65, this.h/2, this.w * 0.7, this.h * 0.75, this.w * 0.8, this.h/2);

            popMatrix();

            noStroke();
        };

        Spider.prototype.update = function() {
            this.pos.x += this.speed * this.dir;

            if(random() < 0.005) {
                game.coins.push(new Bone(this.pos.x, 395));
            }
        };

        Spider.prototype.run = function() {
            this.update();
            this.display();
        };

        //ZamikazeSpider - Inhertis from Spider > Enemy
        var KamikazeSpider = function(pos) {
            Spider.call(this);
            this.timeToFall = random(200, 700);
            this.pos = pos;
            this.dropSpeed = 7;
            this.yDir = 1;
            this.isOnGround = false;
        };

        KamikazeSpider.prototype = Object.create(Spider.prototype);

        KamikazeSpider.prototype.drop = function() {
            if(!this.isOnGround) {
                this.timeToFall--;

                if(this.timeToFall < 0) {
                    this.pos.y += this.dropSpeed;
                    if(this.pos.y >= 360) {
                        this.isOnGround = true;
                    }
                }
            }
            this.display();
        };

        //Ghost Object - Inhertis from Enemy
        var Ghost = function(pos) {
            Enemy.call(this, pos);
            this.bodyColor = color(240, 237, 235, 200);
            this.eyeColor = color(38, 38, 38);
            this.theta = 0.0;
            this.amplitude = 20.0;
            this.dy = 0.0;
            this.ybase = this.pos.y;
        };

        Ghost.prototype = Object.create(Enemy.prototype);

        Ghost.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            if(this.dir === -1) {
                scale(-1, 1);
                translate(-this.w, 0);        
            }

            //body
            noStroke();
            fill(this.bodyColor);
            rect(0, 0, this.w, this.h*0.75, 8, 8, 0, 0);    
            arc(this.w/6, this.h*0.75, this.w/3, this.h/2, 0, radians(180));    
            arc(this.w/2, this.h*0.75, this.w/3, this.h/2, 0, radians(180));    
            arc(this.w - this.w/6, this.h*0.75, this.w/3, this.h/2, 0, radians(180));

            //eyes
            fill(this.eyeColor);
            ellipse(this.w/3 + this.speed, this.h/3.5, 4, 4);
            ellipse(this.w - this.w/3 + this.speed, this.h/3.5, 4, 4);

            popMatrix();

            noStroke();
        };

        Ghost.prototype.update = function() {
            this.theta += 3;
            this.dy = sin(radians(this.theta)) * this.amplitude;

            this.pos.x += this.speed * this.dir;
            this.pos.y = this.ybase + this.dy;

            if(random() < 0.005) {
                game.coins.push(new Bone(this.pos.x, 395));
            }
        };

        Ghost.prototype.run = function() {
            this.update();
            this.display();
        };

        //ZamikazeGhost - Inhertis from Ghost > Enemy
        var KamikazeGhost = function(pos) {
            Ghost.call(this);
            this.timeToFall = random(200, 700);
            this.pos = pos;
            this.dropSpeed = 5;
            this.isOnGround = false;
            this.amplitude = 30.0;
            this.ybase = this.pos.y;
        };

        KamikazeGhost.prototype = Object.create(Ghost.prototype);

        KamikazeGhost.prototype.drop = function() {
            if(!this.isOnGround) {
                this.timeToFall--;

                if(this.timeToFall < 0) {
                    this.pos.y += this.dropSpeed;
                    if(this.pos.y >= 360) {
                        this.isOnGround = true;
                    }
                }
            }
            this.display();
        };

        //Vampire Object - Inhertis from Enemy
        var Vampire = function(pos) {
            Enemy.call(this, pos);
            this.headColor = color(214, 213, 171);
            // this.bodyColor = random() < 0.5 ? color(115, 13, 13) : color(12, 12, 12);
            this.bodyColor = color(12, 12, 12);
            this.hairColor = color(22, 22, 22);
            this.eyeColor = color(38, 38, 38);
            this.fangColor = color(245, 242, 242);
            this.capeColor = random() < 0.5 ? color(115, 13, 13) : color(12, 12, 12);

            this.batColor = color(0);

            this.isBat = false;

            this.theta = 0.0;
            this.amplitude = 20.0;
            this.dy = 0.0;
            this.ybase = this.pos.y;
        };

        Vampire.prototype = Object.create(Enemy.prototype);

        Vampire.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            if(this.dir === -1) {
                scale(-1, 1);
                translate(-this.w, 0);        
            }

            if(this.isBat) {
                fill(this.batColor);
                //wings
                noStroke();
                pushMatrix();
                    translate(0, 0);
                    rotate(radians(this.dy*1.5));
                    beginShape();
                        vertex(0, 3);
                        vertex(-30, 3);
                        bezierVertex(-29, 6, -26, 9, -27, 12);
                        bezierVertex(-24, 8, -19, 8, -13, 10);
                        bezierVertex(-10, 7, 5, 7, 0, 6);
                        vertex(0, 3);
                    endShape();
                popMatrix();
                pushMatrix();
                    translate(15, 0);
                    rotate(radians(-this.dy*1.5));
                    beginShape();
                        vertex(0, 3);
                        vertex(30, 3);
                        bezierVertex(29, 6, 26, 9, 27, 12);
                        bezierVertex(24, 8, 19, 8, 13, 10);
                        bezierVertex(10, 7, -5, 7, 0, 6);
                        vertex(0, 3);
                    endShape();
                popMatrix();
                //body
                noStroke();
                fill(this.batColor);
                rect(0, 0, 15, 15, 3);
                //ears
                triangle(2, 0, 5, -6, 8, 0);
                triangle(this.w-2, 0, this.w-5, -6, this.w-8, 0);
                //eyes
                fill(255);
                ellipse(5, 4, 3, 3);
                ellipse(this.w-5, 4, 3, 3);
            }
            else { //vampire
                //body
                noStroke();
                fill(this.headColor);
                rect(0, 0, this.w, this.h, 3);
                fill(this.bodyColor);
                rect(0, this.h/2, this.w, this.h/2);

                //cape
                fill(this.capeColor);
                triangle(0, this.h/4, 0, this.h*0.6, -this.w/6, this.h/4);
                triangle(this.w, this.h/4, this.w, this.h*0.6, this.w + this.w/6, this.h/4);

                //fangs
                fill(this.fangColor);
                triangle(this.w * 0.3, this.h/2, this.w * 0.4, this.h * 0.75, this.w * 0.45, this.h/2);
                triangle(this.w * 0.75, this.h/2, this.w * 0.8, this.h * 0.75, this.w * 0.9, this.h/2);

                triangle(this.w * 0.45, this.h/2, this.w * 0.5, this.h * 0.65, this.w * 0.55, this.h/2);
                triangle(this.w * 0.65, this.h/2, this.w * 0.7, this.h * 0.65, this.w * 0.75, this.h/2);
                triangle(this.w * 0.55, this.h/2, this.w * 0.6, this.h * 0.65, this.w * 0.65, this.h/2);

                //eyes
                fill(this.eyeColor);
                ellipse(this.w/3 + this.w/6, this.h/3.5, 4, 4);
                ellipse(this.w - this.w/3 + this.w/6, this.h/3.5, 4, 4);

                //hair
                stroke(this.hairColor);
                strokeWeight(4);
                line(0, 0, this.w-1, 0);
            }

            popMatrix();

            noStroke();
        };

        Vampire.prototype.update = function() {
            this.pos.x += this.speed * this.dir;

            if(random() < 0.005) {
                game.coins.push(new Bone(this.pos.x, 395));
            }
        };

        Vampire.prototype.run = function() {
            this.update();
            this.display();
        };

        //ZamikazeVampire - Inhertis from Vampire > Enemy
        var KamikazeVampire = function(pos) {
            Vampire.call(this);
            this.timeToFall = random(200, 700);
            this.pos = pos;
            this.dropSpeed = 5;
            this.isOnGround = false;
            this.amplitude = 20.0;
            this.ybase = this.pos.y;
            this.isBat = true;
            this.w = 15;
            this.h = 15;
            this.flyUp = 0;
        };

        KamikazeVampire.prototype = Object.create(Vampire.prototype);

        KamikazeVampire.prototype.drop = function() {
            if(!this.isOnGround) {
                this.timeToFall--;

                if(this.timeToFall < 0) {
                    this.pos.y += this.dropSpeed;
                    if(this.pos.y >= 360) {
                        this.isOnGround = true;
                    }
                }
            }
            this.display();
        };

        //Skeleton Object
        var Skeleton = function(pos) {
            Enemy.call(this, pos);
            this.headColor = color(31, 29, 28);
            this.bodyColor = color(3, 3, 3);
            this.eyeColor = color(180, 180, 180);
            this.legColor = color(8, 8, 8);
        };

        Skeleton.prototype = Object.create(Enemy.prototype);

        Skeleton.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            if(this.dir === -1) {
                scale(-1, 1);
                translate(-this.w, 0);        
            }

            //body
            noStroke();
            fill(222, 222, 222);
            rect(0, 0, this.w, this.h/2, 3);

            stroke(222, 222, 222);
            strokeWeight(1);
            noFill();

            //spine
            line(this.w/2, this.h/2, this.w/2, this.h);

            //ribs
            line(this.w/8, this.h * 0.65, this.w - this.w/8, this.h * 0.65);    
            line(this.w/8, this.h * 0.8, this.w - this.w/8, this.h * 0.8);    
            line(this.w/8, this.h * 0.95, this.w - this.w/8, this.h * 0.95);

            //arms
            line(this.w/8, this.h * 0.65, -this.w/75, this.h * 0.9);    
            line(this.w - this.w/8, this.h * 0.65, this.w + this.w/75, this.h * 0.9);

            noStroke();
            //eyes
            fill(38, 38, 38);
            var dir = -0;
            ellipse(this.w/3 + this.speed, this.h/3.5, 4, 4);
            ellipse(this.w - this.w/3 + this.speed, this.h/3.5, 4, 4);

            popMatrix();

            noStroke();
        };

        Skeleton.prototype.update = function() {
            this.pos.x += this.speed * this.dir;

            if(random() < 0.005) {
                game.coins.push(new Bone(this.pos.x, 395));
            }
        };

        Skeleton.prototype.run = function() {
            this.update();
            this.display();
        };
    } //Enemies (Inherited)

    {
        //Player Object
        var Player = function(x, y, w, h) {
            this.startpos = new PVector(x, y);
            this.pos = new PVector(x, y);
            this.w = w;
            this.h = h;
            this.xs = 0;
            this.ys = 0;
            this.canJump = false;

            this.gravity = 0.5;
            this.jumpPower = 10;
            this.acceleration = 0.5;
            this.maxSpeed = 5;
            this.momentum = 0.5;

            this.armed = 0; //angle of the guns - 0 (loaded) or 70 (unloaded) 

            this.fired = false;
            this.bulletsInit = 2;
            this.bullets = game.levels[game.level].bullets || this.bulletsInit;
            this.bullet = {
                pos: new PVector(0, 0),
                w: 5,
                h: 5,
                dir: 0,
                speed: 10
            };
        };

        Player.prototype.display = function() {
            noStroke();
            //body
            fill(215, 177, 112);
            rect(this.pos.x, this.pos.y, this.w, this.h, 3);
            fill(68, 112, 53);
            rect(this.pos.x, this.pos.y+this.h/2, this.w, this.h/2);
            //dark green spots (camo)
            fill(37, 78, 36);
            ellipse(this.pos.x + this.w/8, this.pos.y + this.h / 1.4, 7, 7);
            ellipse(this.pos.x + this.w/5, this.pos.y + this.h / 1.5, 5, 5);
            ellipse(this.pos.x + this.w/3, this.pos.y + this.h / 1.2, 9, 7);
            ellipse(this.pos.x + this.w/2, this.pos.y + this.h / 1.5, 9, 7);
            ellipse(this.pos.x + this.w/1.8, this.pos.y + this.h / 1.2, 5, 5);
            ellipse(this.pos.x + this.w/1.4, this.pos.y + this.h / 1.3, 5, 5);
            ellipse(this.pos.x + this.w/1.2, this.pos.y + this.h / 1.4, 9, 9);
            //eyes
            fill(28, 28, 28);
            //moving eyes in direction of player
            ellipse(this.pos.x + this.w/3 + this.xs/this.maxSpeed*this.w/6, this.pos.y + this.h/3.5, 5, 5);
            ellipse(this.pos.x + this.w - this.w/3 + this.xs/this.maxSpeed*this.w/6, this.pos.y + this.h/3.5, 5, 5);
            //helmet
            stroke(68, 112, 53);
            strokeWeight(4);
            line(this.pos.x, this.pos.y, this.pos.x + this.w-1, this.pos.y);

            noStroke();

            //hands and guns...
            pushMatrix();
            translate(this.pos.x + this.w/2, this.pos.y + this.h/1.8);

                //hands
                fill(215, 177, 112);
                ellipse(-this.w/2, this.h/6, 8, 8);
                ellipse(this.w/2, this.h/6, 8, 8);

                //guns
                // stroke(38, 38, 38);
                stroke(102, 102, 102);
                strokeWeight(4);
                //left gun
                pushMatrix();
                    translate(-this.w/2, this.h/10);
                    rotate(radians(this.armed));
                    line(0, 0, -this.w/4, 0);
                popMatrix();

                //right gun
                pushMatrix();
                    translate(this.w/2, this.h/10);
                    rotate(radians(-this.armed));
                    line(0, 0, this.w/4, 0);
                popMatrix();    

            popMatrix();

            noStroke();

            if(this.fired) {
                this.bullet.pos.x+= this.bullet.speed * this.bullet.dir;
                // fill(8, 8, 8);
                fill(200, 200, 200);
                ellipse(this.bullet.pos.x, this.bullet.pos.y, this.bullet.w, this.bullet.h);
            }
        };

        Player.prototype.setMovement = function() {
            var speed = 0.1;

            if(keys[RIGHT]) {
                this.xs = constrain(this.xs + this.acceleration, -this.maxSpeed, this.maxSpeed);
            }
            else if(keys[LEFT]) {
                this.xs = constrain(this.xs - this.acceleration, -this.maxSpeed, this.maxSpeed);
            }
            else {
                this.xs *= this.momentum;
            }

            if(this.canJump && keys[UP]) {
                this.ys = -this.jumpPower;
            }
        };

        Player.prototype.update = function() {
            this.setMovement();

            if(!this.canJump) {
                this.ys += this.gravity;
            }

            this.canJump = false;

            this.pos.y = constrain(this.pos.y + this.ys, 0, 450);
            this.pos.x = constrain(this.pos.x + this.xs, 0, 600 - this.w);

            if(this.pos.y + this.h > 400){
                this.ys = 0;
                this.pos.y = 400 - this.h;
                this.canJump = true;
            }

            if(this.bullets > 0) {
                this.armed = 0;
            }
            else {
                this.armed = 70;
            }
        };

        Player.prototype.shoot = function() {
            //Check if already fired - can only fire one bullet at a time
            if(this.fired === false) {
                //If have bullets then fire
                if(this.bullets > 0) {
                    if(keyPressed && keyCode === 68) { //D - shoot right
                        this.bullet.pos.x = this.pos.x + this.w + this.w/3;
                        this.bullet.pos.y = this.pos.y + this.h/1.6;
                        this.bullet.dir = 1;
                        this.fired = true;
                        this.bullets--;
                        keyCode = 0;
                    }
                    else if(keyPressed && keyCode === 65) { //A - shoot left
                        this.bullet.pos.x = this.pos.x - this.w/3;
                        this.bullet.pos.y = this.pos.y + this.h/1.6;
                        this.bullet.dir = -1;
                        this.fired = true;
                        this.bullets--;
                        keyCode = 0;
                    }
                }
            }
            else {
                //Check if killed enemy or gone off the screen
                for(var i = game.enemies.length - 1; i >= 0; i--)
                {
                    var enemy = game.enemies[i];
                    if( this.bullet.pos.x + this.bullet.w > enemy.pos.x &&
                        this.bullet.pos.x < enemy.pos.x + enemy.w &&
                        this.bullet.pos.y + this.bullet.h > enemy.pos.y &&
                        this.bullet.pos.y < enemy.pos.y + enemy.h) {
                            game.enemies.splice(i, 1);
                            game.score+= game.levels[game.level].enemyPoints;
                            game.enemiesKilled++;
                            this.fired = false;
                            break;
                        }
                }

                //If bullet goes off the screen then able to fire again
                if(this.bullet.pos.x < 0 || this.bullet.pos.x > width) {
                    this.fired = false;   
                }
            }
        };

        Player.prototype.run = function() {
            this.update();
            this.shoot();
            this.display();
        };
    } //Player

    {
        //Game Object
        var Game = function() {
            this.page = "home";
            this.level = 0;
            this.levels = [
                { //Home | Levels | How | Scores
                    //
                },
                { //Level 1
                    enemiesToKill: 10,
                    story: ("Your mission is to destroy 10 scary skeletons"),
                    bullets: 2,
                    enemyPoints: 25,
                    cointPoints: 5
                },
                { //Level 2
                    enemiesToKill: 15,
                    story: ("Well done!!\nYour next mission is to destroy 15 zany zombies"),
                    bullets: 2,
                    enemyPoints: 30,
                    cointPoints: 10
                },
                { //Level 3
                    enemiesToKill: 15,
                    story: ("Awesome work!!\nYour next mission is to destroy 15 sneaky spiders"),
                    bullets: 3,
                    enemyPoints: 40,
                    cointPoints: 15
                },
                { //Level 4
                    enemiesToKill: 20,
                    story: ("Almost there!!\nYour next mission is to destroy 20 ghoulish ghosts"),
                    bullets: 4,
                    enemyPoints: 50,
                    cointPoints: 20
                },
                { //Level 5
                    enemiesToKill: 50,
                    story: ("Amazing stuff\nYour final mission is to destroy 50 vicious vampires"),
                    bullets: 5,
                    enemyPoints: 75,
                    cointPoints: 25
                }    
            ];
            this.currentScene = this.images.scene0;
            this.enemiesKilled = 0;
            this.enemies = []; //Holds all types of enemie objects
            this.coins = []; //Holds coins
            this.ammunition = []; //Holds ammunition
            this.enemyFrequency = 100; //How often a new enemy appears
            this.ammoFrequency = 400; //How often ammo appears
            this.resetZombies(); //Level 2 - zombies
            this.resetSpiders(); //Level 3 - spiders
            this.resetGhosts(); //Level 4 - ghosts
            this.resetVampires(); //Level 5 - vampires
            this.score = 0;
            this.totalScore = 0;
            this.finalScore = 0;
            this.highScores = [
              {
                user: "Could be you",
                score: 0
              },
              {
                user: "Could be you",
                score: 0
              },
              {
                user: "Could be you",
                score: 0
              },
              {
                user: "Could be you",
                score: 0
              },
              {
                user: "Could be you",
                score: 0
              },
              {
                user: "Could be you",
                score: 0
              },
              {
                user: "Could be you",
                score: 0
              }];
            this.textColor = color(255);
            this.defaultBackgroundColor = color(32, 60, 61);
            this.backgroundColor = this.defaultBackgroundColor;
            this.homeButton = new Button ({
                x: 190,
                y: 250,
                content: "Home",
                page: "home"
            });
            this.backButton = new Button ({
                x: 250,
                y: 370,
                content: "Home",
                page: "home"
            });
            this.completeButton = new Button ({
                x: 250,
                y: 370,
                content: "Home",
                page: "home"
            });
            this.howButton = new Button({
                x: 70,
                y: 200,
                content: "How",
                page: "how"
            });
            this.levelsButton = new Button({
                x: 310,
                y: 200,
                content: "Levels",
                page: "levels"
            });
            this.scoresButton = new Button({
                x: 430,
                y: 200,
                content: "Scores",
                page: "scores"
            });
            this.startButton = new Button({
                x: 190,
                y: 200,
                content: "Start",
                page: "start"
            });
            this.playButton = new Button({
                x: 310,
                y: 250,
                content: "Play",
                page: "play"
            });
            this.replayButton = new Button({
                x: 310,
                y: 250,
                content: "Replay",
                page: "replay"
            });
            this.nextButton = new Button({
                x: 310,
                y: 250,
                content: "Next",
                page: "next"
            });
            this.level1Button = new Button({
                x: 50,
                y: 100,
                width: 150,
                textSize: 16,
                content: "Level 1\n\nScary Skeletons",
                page: "level",
                level: 1
            });
            this.level2Button = new Button({
                x: 225,
                y: 100,
                width: 150,
                textSize: 16,
                content: "Level 2\n\nZany Zombies",
                page: "level",
                level: 2
            });
            this.level3Button = new Button({
                x: 400,
                y: 100,
                width: 150,
                textSize: 16,
                content: "Level 3\n\nSlipery Spiders",
                page: "level",
                level: 3
            });
            this.level4Button = new Button({
                x: 50,
                y: 230,
                width: 150,
                textSize: 16,
                content: "Level 4\n\nGhoulish Ghosts",
                page: "level",
                level: 4
            });
            this.level5Button = new Button({
                x: 225,
                y: 230,
                width: 150,
                textSize: 16,
                content: "Level 5\n\nVicious Vampires",
                page: "level",
                level: 5
            });
        };

        //Resets Kamikaze Zombie and Floating Ledge
        Game.prototype.resetZombies = function() {
            this.kamikazeZombie = new KamikazeZombie(new PVector(50, 60));
            this.ledgeX = 0;
            this.ledgeDir = 1;
        };

        //Resets Kamikaze Spiders array
        Game.prototype.resetSpiders = function() {
            this.kamikazeSpiders = [];
            for(var i = 0; i < 3; i++) {
                this.kamikazeSpiders.push(new KamikazeSpider(new PVector(random(30, width-30), random(50, 100))));
            }
        };

        //Resets Kamikaze Ghosts array
        Game.prototype.resetGhosts = function() {
            this.kamikazeGhosts = [];
            for(var i = 0; i < 3; i++) {
                this.kamikazeGhosts.push(new KamikazeGhost(new PVector(random(30, width-30), random(50, 150))));
            }
        };

        //Resets Kamikaze Vampires array
        Game.prototype.resetVampires = function() {
            this.kamikazeVampires = [];
            for(var i = 0; i < 3; i++) {
                this.kamikazeVampires.push(new KamikazeVampire(new PVector(random(30, width-30), random(50, 150))));
            }
        };

        //Resets Levels
        Game.prototype.resetLevel = function() {
            player.bullets = this.levels[this.level].bullets;
            player.fired = false;
            keyCode = 0;

            switch(this.level) {
                case 1:
                    this.backgroundColor = color(38, 62, 62);
                    this.currentScene = this.images.scene1;
                    break;
                case 2:
                    this.backgroundColor = color(38, 62, 62);
                    this.currentScene = this.images.scene2;
                    this.resetZombies();
                    break;
                case 3:
                    this.backgroundColor = color(38, 62, 62);
                    this.currentScene = this.images.scene3;
                    this.resetSpiders();
                    break;
                case 4:
                    this.backgroundColor = color(38, 62, 62);
                    this.currentScene = this.images.scene4;
                    this.resetGhosts();
                    break;
                case 5:
                    this.backgroundColor = color(38, 62, 62);
                    this.currentScene = this.images.scene5;
                    this.resetVampires();
                    break;
            }
        };

        //Called from the Button to reset initial values
        Game.prototype.reset = function() {
            switch(this.page) {
                case "start":
                    this.enemiesKilled = 0;
                    this.finalScore = 0;
                    this.totalScore = 0;
                    this.level = 1;
                    this.resetLevel();
                break;
                case "play":
                    break;
                case "replay":
                    this.enemiesKilled = 0;
                    this.resetLevel();
                    break;
                case "next":
                case "level":
                    this.enemiesKilled = 0;
                    this.resetLevel();
                    this.page = "play";
                    break;
                default:
                    this.level = 0;
                    this.currentScene = this.images.scene0;
                    break;
            }
        };

        //Main Ground used in Scenes
        Game.prototype.baseGround = function(groundColors) {
            //BASE GROUND
            var n = 0;
            noStroke();

            for(var i = 0; i < 100; i+=20) {
                fill(groundColors[n % 5]);
                rect(0, 400 + i, 600, 20);
                n++;
            }

            n = 0;

            for(var i = 0; i < 100; i+=20) {
                fill(groundColors[n % 5]);
                for(var j = 0; j < 30; j++) {
                    var x = random(0, 600);
                    var y = random(425 + i, 430 + i);

                    triangle(x, 420 + i, x + 5, y, x + 10, 420 + i);
                }
                n++;
            }

            for(var i = 0; i < 100; i++) {
                strokeWeight(random(2, 5));
                stroke(random(20, 50));
                point(random(0, 600), random(410, 500));
            }
        };

        //Images used in the Game - Preloaded later
        Game.prototype.images = {
            scene0: function() { //home
                //back mountain
                fill(23, 45, 43);
                noStroke();
                beginShape();
                    vertex(0, 310);
                    vertex(30, 325);
                    vertex(60, 295);
                    vertex(90, 320);
                    vertex(130, 280);
                    vertex(160, 295);
                    vertex(240, 220);
                    vertex(320, 290);
                    vertex(335, 275);
                    vertex(390, 320);
                    vertex(440, 290);
                    vertex(500, 320);
                    vertex(540, 280);
                    vertex(580, 310);
                    vertex(600, 270);
                    vertex(600, 500);
                    vertex(0, 500);
                    vertex(0, 320);
                endShape();

                //smooth hill
                fill(32, 60, 61);
                noStroke();
                beginShape();
                    vertex(0, 340);
                    bezierVertex(50, 340, 200, 350, 320, 370);
                    bezierVertex(400, 380, 500, 320, 600, 330);
                    vertex(600, 400);
                    vertex(0, 400);
                    vertex(0, 340);
                endShape();

                //moon
                noStroke();

                fill(200, 200, 200, 5);
                ellipse(100, 120, 150, 150);
                ellipse(100, 120, 140, 140);
                ellipse(100, 120, 130, 130);
                ellipse(100, 120, 120, 120);
                ellipse(100, 120, 110, 110);

                fill(200, 200, 200, 20);
                ellipse(100, 120, 100, 100);

                var groundColors = [color(36, 75, 74), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];
                //var groundColors = [color(140, 59, 6), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];

                //Get the base ground
                game.baseGround(groundColors);

                var p = new Player(280, 360, 40, 40);
                p.display();

                var zombie = new Zombie();
                zombie.dir = 1;
                zombie.pos.x = 160;
                zombie.display();

                var skeleton = new Skeleton();
                skeleton.dir = -1;
                skeleton.pos.x = 360;
                skeleton.pos.y = 440;
                skeleton.display();

                var vampire = new Vampire();
                vampire.dir = -1;
                vampire.pos.x = 500;
                vampire.display();

                var spider = new Spider();
                spider.dir = 1;
                spider.pos.x = 50;
                spider.display();

                var ghost = new Ghost();
                ghost.dir = -1;
                ghost.pos.x = 390;
                ghost.pos.y-= 10;
                ghost.display();

                return get(0, 0, width, height);
            },
            scene1: function() { //level 1 - skeletons
                noStroke();

                fill(18, 17, 16);
                rect(0, 0, width, height);

                fill(43, 40, 36);
                //mountains
                beginShape();
                    vertex(0, 310);
                    vertex(30, 325);
                    vertex(60, 295);
                    vertex(90, 320);
                    vertex(130, 280);
                    vertex(160, 295);
                    vertex(240, 220);
                    vertex(320, 290);
                    vertex(335, 275);
                    vertex(390, 320);
                    vertex(440, 290);
                    vertex(500, 320);
                    vertex(540, 280);
                    vertex(580, 310);
                    vertex(600, 270);
                    vertex(600, 500);
                    vertex(0, 500);
                    vertex(0, 320);
                endShape();

                //smooth hill
                fill(31, 29, 27);
                noStroke();
                beginShape();
                    vertex(0, 340);
                    bezierVertex(50, 340, 200, 350, 320, 370);
                    bezierVertex(400, 380, 500, 320, 600, 330);
                    vertex(600, 400);
                    vertex(0, 400);
                    vertex(0, 340);
                endShape();

                //moon
                noStroke();            
                fill(200, 200, 200, 5);
                ellipse(500, 140, 150, 150);
                ellipse(500, 140, 140, 140);
                ellipse(500, 140, 130, 130);
                ellipse(500, 140, 120, 120);
                ellipse(500, 140, 110, 110);

                fill(200, 200, 200, 20);
                ellipse(500, 140, 100, 100);

                var graveStone = new GraveStone(
                {
                    pos: new PVector(450, 375),
                    scale: new PVector(0.3, 0.3),
                    angle: 5
                });
                graveStone.display();

                var cross = new Cross(
                    {
                        pos: new PVector(150, 370),
                        scale: new PVector(0.4, 0.4),
                        angle: -5
                    });
                    cross.display();

                var groundColors = [color(18, 17, 16), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];
                game.baseGround(groundColors);

                return get(0, 0, width, height);
            },
            scene2: function() { //level 2 - zombies
                //back mountain
                fill(23, 45, 43);
                noStroke();

                //mountains
                beginShape();
                    vertex(0, 310);
                    vertex(30, 325);
                    vertex(60, 295);
                    vertex(90, 320);
                    vertex(130, 280);
                    vertex(160, 295);
                    vertex(240, 220);
                    vertex(320, 290);
                    vertex(335, 275);
                    vertex(390, 320);
                    vertex(440, 290);
                    vertex(500, 320);
                    vertex(540, 280);
                    vertex(580, 310);
                    vertex(600, 270);
                    vertex(600, 500);
                    vertex(0, 500);
                    vertex(0, 320);
                endShape();

                //smooth hill
                fill(32, 60, 61);
                noStroke();
                beginShape();
                    vertex(0, 340);
                    bezierVertex(50, 340, 200, 350, 320, 370);
                    bezierVertex(400, 380, 500, 320, 600, 330);
                    vertex(600, 400);
                    vertex(0, 400);
                    vertex(0, 340);
                endShape();

                //moon
                noStroke();            
                fill(200, 200, 200, 5);
                ellipse(100, 120, 150, 150);
                ellipse(100, 120, 140, 140);
                ellipse(100, 120, 130, 130);
                ellipse(100, 120, 120, 120);
                ellipse(100, 120, 110, 110);

                fill(200, 200, 200, 20);
                ellipse(100, 120, 100, 100);

                var groundColors = [color(36, 75, 74), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];
                //var groundColors = [color(140, 59, 6), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];

                //Get the base ground
                game.baseGround(groundColors);

                return get(0, 0, width, height);
            },
            scene3: function() { //level 3 - spiders
                noStroke();

                fill(82, 47, 30);
                rect(0, 0, width, height);

                fill(48, 27, 18);
                //mountains
                beginShape();
                    vertex(0, 310);
                    vertex(30, 325);
                    vertex(60, 295);
                    vertex(90, 320);
                    vertex(130, 280);
                    vertex(160, 295);
                    vertex(240, 220);
                    vertex(320, 290);
                    vertex(335, 275);
                    vertex(390, 320);
                    vertex(440, 290);
                    vertex(500, 320);
                    vertex(540, 280);
                    vertex(580, 310);
                    vertex(600, 270);
                    vertex(600, 500);
                    vertex(0, 500);
                    vertex(0, 320);
                endShape();

                //smooth hill
                fill(64, 37, 24);
                noStroke();
                beginShape();
                    vertex(0, 340);
                    bezierVertex(50, 340, 200, 350, 320, 370);
                    bezierVertex(400, 380, 500, 320, 600, 330);
                    vertex(600, 400);
                    vertex(0, 400);
                    vertex(0, 340);
                endShape();

                //moon
                noStroke();            
                fill(200, 200, 200, 5);
                ellipse(500, 140, 150, 150);
                ellipse(500, 140, 140, 140);
                ellipse(500, 140, 130, 130);
                ellipse(500, 140, 120, 120);
                ellipse(500, 140, 110, 110);

                fill(200, 200, 200, 20);
                ellipse(500, 140, 100, 100);

                var spiderWeb = new SpiderWeb({pos: new PVector(300, 0), scale: new PVector(0.75, 0.75)});
                spiderWeb.display();
                var spiderWeb2 = new SpiderWeb({pos: new PVector(400, 0), scale: new PVector(-1, 1)});
                spiderWeb2.display();

                var groundColors = [color(82, 47, 30), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];
                game.baseGround(groundColors);

                return get(0, 0, width, height);
            },
            scene4: function() { //level 4 - ghosts
                noStroke();

                fill(59,69,99);
                rect(0, 0, width, height);

                fill(28,32,51);
                //mountains
                beginShape();
                    vertex(0, 310);
                    vertex(30, 325);
                    vertex(60, 295);
                    vertex(90, 320);
                    vertex(130, 280);
                    vertex(160, 295);
                    vertex(240, 220);
                    vertex(320, 290);
                    vertex(335, 275);
                    vertex(390, 320);
                    vertex(440, 290);
                    vertex(500, 320);
                    vertex(540, 280);
                    vertex(580, 310);
                    vertex(600, 270);
                    vertex(600, 500);
                    vertex(0, 500);
                    vertex(0, 320);
                endShape();

                //smooth hill
                fill(39,48,75);
                noStroke();
                beginShape();
                    vertex(0, 340);
                    bezierVertex(50, 340, 200, 350, 320, 370);
                    bezierVertex(400, 380, 500, 320, 600, 330);
                    vertex(600, 400);
                    vertex(0, 400);
                    vertex(0, 340);
                endShape();

                //moon
                noStroke();            
                fill(200, 200, 200, 5);
                ellipse(500, 140, 150, 150);
                ellipse(500, 140, 140, 140);
                ellipse(500, 140, 130, 130);
                ellipse(500, 140, 120, 120);
                ellipse(500, 140, 110, 110);

                fill(200, 200, 200, 20);
                ellipse(500, 140, 100, 100);

                var tree = new Tree({
                    x: random(100, 275),
                    y: 400,
                    length: 45,
                    weight: 6,
                    depth:4
                });

                var tree2 = new Tree({
                    x: random(325, 500),
                    y: 400,
                    length: 40,
                    weight: 6,
                    depth:4
                });

                tree.display();
                tree2.display();

                var groundColors = [color(59,69,99), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];
                game.baseGround(groundColors);

                return get(0, 0, width, height);
            },
            scene5: function() { //level 5 - vampires
                noStroke();

                fill(18, 17, 16);
                rect(0, 0, width, height);

                fill(61, 10, 10);
                //fill(43, 40, 36);
                //mountains
                beginShape();
                    vertex(0, 310);
                    vertex(30, 325);
                    vertex(60, 295);
                    vertex(90, 320);
                    vertex(130, 280);
                    vertex(160, 295);
                    vertex(240, 220);
                    vertex(320, 290);
                    vertex(335, 275);
                    vertex(390, 320);
                    vertex(440, 290);
                    vertex(500, 320);
                    vertex(540, 280);
                    vertex(580, 310);
                    vertex(600, 270);
                    vertex(600, 500);
                    vertex(0, 500);
                    vertex(0, 320);
                endShape();

                //smooth hill
                fill(82, 15, 15);
                //fill(31, 29, 27);
                noStroke();
                beginShape();
                    vertex(0, 340);
                    bezierVertex(50, 340, 200, 350, 320, 370);
                    bezierVertex(400, 380, 500, 320, 600, 330);
                    vertex(600, 400);
                    vertex(0, 400);
                    vertex(0, 340);
                endShape();

                //moon
                noStroke();            
                fill(200, 200, 200, 5);
                ellipse(450, 160, 200, 200);
                ellipse(450, 160, 190, 190);
                ellipse(450, 160, 180, 180);
                ellipse(450, 160, 170, 170);
                ellipse(450, 160, 160, 160);

                fill(200, 200, 200, 20);
                ellipse(450, 160, 150, 150);

                var groundColors = [color(119,22,22), color(29, 29, 29), color(38, 38, 38), color(50, 50, 50), color(38, 38, 38)];
                game.baseGround(groundColors);

                return get(0, 0, width, height);
            },
            floatingLedge: function() { //level 2 - zombies
                var groundColors = [color(36, 75, 74), color(29, 29, 29)];

                var n = 0;
                var index = 0;
                noStroke();

                for(var i = 0; i < 40; i+=20) {
                    fill(groundColors[n]);
                    rect(0, 0 + i, 100, 20);
                    n++;
                }

                n = 0;

                for(var i = 0; i < 40; i+=20) {
                    fill(groundColors[n]);
                    for(var j = 0; j < 7; j++) {
                        var x = random(0, 90);
                        var y = random(25 + i, 30 + i);

                        triangle(x, i + 20, x + 5, y, x + 10, i + 20);
                    }
                    n++;
                }

                for(var i = 0; i < 15; i++) {
                    strokeWeight(random(2, 5));
                    stroke(random(20, 50));
                    point(random(0, 100), random(0, 40));
                }

                return get(0, 0, 100, 60);
            }
        };

        //Drops Ammo using ammoFrequency
        Game.prototype.dropAmmo = function() {
            if(frameCount % this.ammoFrequency === 0) {
                this.ammunition.push(new Ammo(random(20, 550), -50));
            }
        };

        //Check if player collides with enemy
        Game.prototype.checkCollisionEnemy = function(player) {
            var collision = false;
            for(var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                if( player.pos.x + player.w > enemy.pos.x &&
                    player.pos.y + player.h > enemy.pos.y &&
                    player.pos.x < enemy.pos.x + enemy.w &&
                    player.pos.y < enemy.pos.y + enemy.h) {
                    collision = true;
                    break;
                }
            }

            return collision;
        };

        //Check if player collides with ammo
        Game.prototype.checkCollisionAmmo = function(player) {
            var collision = false;
            for(var i = this.ammunition.length - 1; i >= 0; i--) {
                var ammo = this.ammunition[i];
                if( player.pos.x + player.w > ammo.pos.x &&
                    player.pos.y + player.h > ammo.pos.y &&
                    player.pos.x < ammo.pos.x + ammo.w &&
                    player.pos.y < ammo.pos.y + ammo.h) {
                    collision = true;
                    this.ammunition.splice(i, 1);
                    break;
                }
            }

            return collision;
        };

        //Check if player collides with coin
        Game.prototype.checkCollisionCoin = function(player, coin) {
            var collision = false;

            if( player.pos.x + player.w > coin.pos.x &&
                player.pos.y + player.h > coin.pos.y &&
                player.pos.x < coin.pos.x + coin.w &&
                player.pos.y < coin.pos.y + coin.h) {
                collision = true;
            }

            return collision;
        };

        //Updates the Kamizaze Zombie
        Game.prototype.updateKamikazeZombie = function() { //level 2 - zombies
            this.ledgeX+= 0.5 * this.ledgeDir;
            if(this.kamikazeZombie.timeToFall > 0) {
                this.kamikazeZombie.pos.x += 0.5 * this.kamikazeZombie.speed * this.kamikazeZombie.dir;

                if(this.kamikazeZombie.pos.x <= this.ledgeX || this.kamikazeZombie.pos.x + this.kamikazeZombie.w >= this.ledgeX + 100) {
                    this.kamikazeZombie.dir *= -1;
                }
            }

            this.kamikazeZombie.drop();

            if(this.kamikazeZombie.isOnGround) {
                this.enemies.push(this.kamikazeZombie);
                this.kamikazeZombie = new KamikazeZombie(new PVector(this.ledgeX + 30, 60));
            }

            if(this.ledgeX + 100 > width || this.ledgeX < 0) {
                this.ledgeDir*= -1;
            }
        };

        //Updates the Kamikaze Spiders
        Game.prototype.updateKamikazeSpiders = function() { //level 3 - spiders
            for(var i = this.kamikazeSpiders.length - 1; i >= 0 ; i--) {
                var kamizazeSpider = this.kamikazeSpiders[i];

                if(kamizazeSpider.timeToFall > 0) {
                    strokeWeight(1);
                    //stroke(150, 150, 150, 220);
                    stroke(255, 255, 255, 50);
                    line(kamizazeSpider.pos.x + kamizazeSpider.w/2, 0, kamizazeSpider.pos.x + kamizazeSpider.w/2, kamizazeSpider.pos.y);
                    kamizazeSpider.pos.y += 0.5 * kamizazeSpider.speed * kamizazeSpider.yDir;

                    if(kamizazeSpider.pos.y < 50 || kamizazeSpider.pos.y + kamizazeSpider.h > 200) {
                        kamizazeSpider.yDir *= -1;
                    }
                }

                kamizazeSpider.drop();

                if(kamizazeSpider.isOnGround) {
                    this.enemies.push(kamizazeSpider);
                    this.kamikazeSpiders.splice(i, 1);
                    this.kamikazeSpiders.push(new KamikazeSpider(new PVector(random(30, width-30), random(50, 100))));
                }
            }
        };

        //Updates the Kamikaze Ghosts
        Game.prototype.updateKamikazeGhosts = function() { //level 4 - ghosts
            for(var i = this.kamikazeGhosts.length - 1; i >= 0 ; i--) {
                var kamizazeGhost = this.kamikazeGhosts[i];

                if(kamizazeGhost.timeToFall > 0) {
                    kamizazeGhost.theta += 3;
                    kamizazeGhost.dy = sin(radians(kamizazeGhost.theta)) * kamizazeGhost.amplitude;

                    kamizazeGhost.pos.x += kamizazeGhost.speed * kamizazeGhost.dir;
                    kamizazeGhost.pos.y = kamizazeGhost.ybase + kamizazeGhost.dy;

                    if(kamizazeGhost.pos.x < 50 || kamizazeGhost.pos.x + kamizazeGhost.w > width-50) {
                        kamizazeGhost.dir *= -1;
                    }
                }

                kamizazeGhost.drop();

                if(kamizazeGhost.isOnGround) {
                    this.enemies.push(new KamikazeGhost(new PVector(kamizazeGhost.pos.x, kamizazeGhost.pos.y)));
                    this.kamikazeGhosts.splice(i, 1);
                    this.kamikazeGhosts.push(new KamikazeGhost(new PVector(random(30, width-30), random(50, 150))));
                }
            }
        };

        //Updates the Kamikaze Vampires
        Game.prototype.updateKamikazeVampires = function() { //level 5 - vampires
            for(var i = this.kamikazeVampires.length - 1; i >= 0 ; i--) {
                var kamizazeVampire = this.kamikazeVampires[i];

                if(kamizazeVampire.timeToFall > 0) {
                    kamizazeVampire.theta += 10;
                    kamizazeVampire.dy = sin(radians(kamizazeVampire.theta)) * kamizazeVampire.amplitude;

                    kamizazeVampire.pos.x += kamizazeVampire.speed * kamizazeVampire.dir;
                    kamizazeVampire.pos.y = kamizazeVampire.ybase + kamizazeVampire.dy;
                    if(kamizazeVampire.flyUp > 0 && kamizazeVampire.pos.y > kamizazeVampire.flyUp) {
                        kamizazeVampire.ybase-=2;
                    }

                    if(kamizazeVampire.pos.x < 50 || kamizazeVampire.pos.x + kamizazeVampire.w > width-50) {
                        kamizazeVampire.dir *= -1;
                    }
                }

                kamizazeVampire.drop();

                if(kamizazeVampire.isOnGround) {
                    var vampire = new Vampire();
                    vampire.pos.x = kamizazeVampire.pos.x;
                    vampire.pos.y = 360;

                    this.enemies.push(vampire);
                    this.kamikazeVampires.splice(i, 1);
                    this.kamikazeVampires.push(new KamikazeVampire(new PVector(random(30, width-30), random(50, 150))));
                }
            }
        };

        //Updates the Vampires (transition from vampire to bat)
        Game.prototype.updateVampires = function() { //level 5 - vampires
            for(var i = this.enemies.length - 1; i >= 0 ; i--) {
                var vampire = this.enemies[i];

                if(random() < 0.002) {
                    this.enemies.splice(i, 1);
                    var kamikazeVampire = new KamikazeVampire(new PVector(vampire.pos.x, 330));
                    kamikazeVampire.flyUp = random(100, 200);
                    this.kamikazeVampires.push(kamikazeVampire);
                }
            }
        };

        //Displays the stats at the top of the screen
        Game.prototype.stats = function() {
            fill(50, 50, 50, 220);
            rect(0, 0, width, 40);
            fill(200, 200, 200, 150);
            textSize(18);
            textAlign(LEFT, TOP);
            text("Level: " + this.level, 50, 10);
            text("Bullets: " + player.bullets, 160, 10);
            text("Enemies: " + (this.levels[this.level].enemiesToKill - this.enemiesKilled), 280, 10);
            text("Score: " + (this.finalScore + this.score), 420, 10);
        };

        //Updates Enemies
        Game.prototype.updateEnemies = function() {
            for(var i = this.enemies.length - 1; i >= 0; i --){
                this.enemies[i].run();
                if(this.enemies[i].pos.x < -300 || this.enemies[i].pos.x > 900){
                    this.enemies.splice(i, 1);
                }
            }
        };

        //Updates Ammo
        Game.prototype.updateAmmo = function() {
            this.dropAmmo();

            for(var i = this.ammunition.length - 1; i >= 0; i --){
                this.ammunition[i].run();
                if(this.ammunition[i].timeToLive < 0) {
                    this.ammunition.splice(i, 1);
                }
            }

            if(this.checkCollisionAmmo(player)) {
                player.bullets += this.levels[this.level].bullets;
            }
        };

        //Updates Coins
        Game.prototype.updateCoins = function() {
            for(var i = this.coins.length - 1; i >= 0; i--) {
                this.coins[i].run();
                if(this.checkCollisionCoin(player, this.coins[i])) {
                    this.score += this.levels[this.level].cointPoints;
                    this.coins.splice(i, 1);
                }
                else if(this.coins[i].timeToLive < 0) {
                    this.coins.splice(i, 1);
                }
            }
        };

        //Checks if game over (if player collides with enemy)
        Game.prototype.checkGameOver = function() {
            if(this.checkCollisionEnemy(player)) {
                this.totalScore = this.finalScore + this.score;
                this.score = 0;

                //reset starting values
                player.pos = player.startpos.get();
                player.fired = false;
                player.bullets = this.levels[this.level].bullets; // player.bulletsInit;
                this.enemies = [];
                this.coins = [];
                this.ammunition = [];

                this.page = "gameover";
            }
        };

        //Check if level complete (if player destroyes the required number of enemies for that level)
        Game.prototype.checkLevelComplete = function() {
            if(this.levels[this.level].enemiesToKill === this.enemiesKilled) {
                this.finalScore += this.score;
                this.score = 0;

                //reset starting values
                player.pos = player.startpos.get();
                player.fired = false;
                player.bullets = player.bulletsInit;
                this.enemies = [];
                this.coins = [];
                this.ammunition = [];

                this.level++;

                if(this.level <= 5) {
                    this.page = "next";
                }
                else {
                    this.page = "gamecomplete";
                }

            }
        };

        //Run the game
        Game.prototype.run = function() {
            player.run();
            this.stats();
            this.updateEnemies();
            this.updateAmmo();
            this.updateCoins();
            this.checkLevelComplete();
            this.checkGameOver();
        };

        //Home Page
        Game.prototype.home = function() {
            this.backgroundColor = this.defaultBackgroundColor;
            image(this.images.scene0, 0, 0);
            fill(this.textColor);
            textSize(60);
            text("MONSTER MASH", width/2, 100);

            this.howButton.draw();
            this.startButton.draw();
            this.levelsButton.draw();
            this.scoresButton.draw();
        };

        //How Page
        Game.prototype.how = function() {
            this.backgroundColor = this.defaultBackgroundColor;
            image(this.images.scene2, 0, 0);
            fill(this.textColor);
            textSize(40);
            text("How", width/2, 50);
            textSize(16);
            textAlign(CENTER, TOP);
            text("Use the arrow keys to move left, right and jump\nPress the A and D keys to shoot\nAvoid the enemy to your left, right, above and below\n\nYou can only shoot one bullet at a time\nTo reload make sure you collect more ammo\n\nEach level has a set number of monsters you need to destroy\nbefore you can move to the next level\n\nIf you want to play a particular level, you can\nalways go directly to each level in the levels page", width/2, 120);
            this.backButton.draw();
        };

        //Levels Page
        Game.prototype.gameLevels = function() {
            this.backgroundColor = this.defaultBackgroundColor;
            image(this.images.scene2, 0, 0);
            fill(this.textColor);
            textSize(40);
            text("Levels", width/2, 50);
            this.backButton.draw();
            this.level1Button.draw();
            this.level2Button.draw();
            this.level3Button.draw();
            this.level4Button.draw();
            this.level5Button.draw();
        };

        //High Scores Page
        Game.prototype.scores = function() {
            this.backgroundColor = this.defaultBackgroundColor;
            image(this.images.scene2, 0, 0);
            fill(this.textColor);
            textSize(40);
            textAlign(CENTER, TOP);
            text("High Scores", width/2, 50);
            textSize(16);

            var hs = "";
            for(var i = 0; i < this.highScores.length; i++) {
                hs+= (i+1) + ". " + this.highScores[i].user + ": " + this.highScores[i].score + "\n\n";
            }

            text(hs, width/2, 120);
            this.backButton.draw();
        };

        //Game Complete Page
        Game.prototype.gameComplete = function() {
            this.backgroundColor = color(38, 62, 62);
            //image(this.images.scene1, 0, 0);

            textSize(40);
            fill(this.textColor);
            text("GAME COMPLETE", 300, 60);
            text("Total Score: " + this.finalScore, 300, 110);
            textSize(16);
            text("Congratulations, you have destroyed your share of monsters.\n\nThe remaining monsters have now decided to be your friends\nbecause you are so awesome.\n\nHowever, if you want to destroy more monsters,\nclick on the Home button to play again.", 300, 230);
            this.completeButton.draw();
        };

        //Play (runs the appropriate level)
        Game.prototype.play = function() {
            switch(this.level) {
                case 1:
                    this.level1();
                    this.run();
                    break;
                case 2:
                    this.level2();
                    this.run();
                    break;
                case 3:
                    this.level3();
                    this.run();
                    break;
                case 4:
                    this.level4();
                    this.run();
                    break;
                case 5:
                    this.level5();
                    this.run();
                    break;
                case 6:
                    this.gameComplete();
                    break;
            }
        };

        //Level 1 - Skeletons
        Game.prototype.level1 = function() {
            image(this.images.scene1, 0, 0);

            if(frameCount % this.enemyFrequency === 0){        
                this.enemies.push(new Skeleton());  
            }
        };

        //Level 2 - Zombies
        Game.prototype.level2 = function() {
            image(this.images.scene2, 0, 0);
            image(this.images.floatingLedge, this.ledgeX, 100);

            this.updateKamikazeZombie();

            if(frameCount % this.enemyFrequency === 0){
                this.enemies.push(new Zombie());
            }
        };

        //Level 3 - Spiders
        Game.prototype.level3 = function() {
            image(this.images.scene3, 0, 0);

            this.updateKamikazeSpiders();

            if(frameCount % this.enemyFrequency === 0){ 
                this.enemies.push(new Spider());     
            }
        };

        //Level 4 - Ghosts
        Game.prototype.level4 = function() {
            image(this.images.scene4, 0, 0);

            this.updateKamikazeGhosts();

            if(frameCount % this.enemyFrequency === 0){        
                this.enemies.push(new Ghost());
            }
        };

        //Level 5 - Vampires
        Game.prototype.level5 = function() {
            image(this.images.scene5, 0, 0);

            this.updateVampires();
            this.updateKamikazeVampires();

            if(frameCount % this.enemyFrequency === 0){        
                this.enemies.push(new Vampire());
            }
        };

        //Next Page
        Game.prototype.next = function() {
            this.backgroundColor = color(38, 62, 62);
            image(this.currentScene, 0, 0);

            if(this.level === 1) {
                textSize(40);
                fill(this.textColor);
                text("YOUR MISSION", 300, 130);
                this.homeButton.draw();
                this.playButton.draw();
            }
            else if(this.level <= 5) {
                textSize(40);
                fill(this.textColor);
                text("LEVEL COMPLETE", 300, 130);
                this.homeButton.draw();
                this.nextButton.draw();
            }
            fill(this.textColor);
            textSize(18);
            text(this.levels[this.level].story, 300, 180);
        };

        //Game Over Page
        Game.prototype.gameover = function() {
            this.backgroundColor = color(38, 62, 62);
            image(this.currentScene, 0, 0);

            textSize(40);
            fill(this.textColor);
            text("GAME OVER", 300, 130);
            textSize(30);
            text("Score: " + (this.totalScore + this.score), 300, 180);
            text("Enemies Killed: " + this.enemiesKilled + "/" + (this.levels[this.level].enemiesToKill), 300, 215);
            this.homeButton.draw();
            this.replayButton.draw();
        };
    } //Game

    {
        game = new Game();
        player = new Player(200, 200, 40, 40);
    } //Initialize game and player

    {
        for(var i in game.images){
            if(typeof game.images[i] !== 'object'){
                background(0, 0, 0, 0);
                game.images[i] = game.images[i]();
            }
        }
    } //Preload Images

    draw = function() {
        background(game.backgroundColor);
        noStroke();

        switch(game.page) {
            case "home":
                game.home();
                break;
            case "how":
                game.how();
                break;
            case "levels":
                game.gameLevels();
                break;
            case "scores":
                game.scores();
                break;
            case "play":
            case "replay":
                game.play();
                break;
            case "start":
            case "next":
                game.next();
                break;
            case "gamecomplete":
                game.gameComplete();
                break;
            case "gameover":
                game.gameover();
                break;
        }

        //Mouse actions
        cursor(hover ? 'pointer' : 'default');    
        clicked = false;
        hover = false;
    };  
    
  }
}

var canvas = document.getElementById("canvas"); 
var processingInstance = new Processing(canvas, sketchProc);