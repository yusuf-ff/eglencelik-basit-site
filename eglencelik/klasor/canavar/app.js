new Vue({
    el: "#app",
    data: {
        playerHealth: 100,
        monsterHealth: 100,
        logs: [],
        gameIsOn: false,
        attackMultiple: 10,
        specialAttackMultiple: 25,
        firstAidMultiple: 20,
        monsterAttackMultiple: 15,
        logText: {
            attack: "OYUNCU ATAĞI ",
            specialAttack: "ÖZEL OYUNCU ATAĞI ",
            firstAid: "OYUNCUYA CAN YÜKLEMESİ YAPILDI ",
            giveUp: "OYUNCU PES ETTİ :D",
            monsterAttack: "CANAVAR ATAĞI "
        }
    },
    methods: {
        startGame: function(){
           this.gameIsOn= true;

        },
        attack: function(){
            const point = Math.ceil(Math.random()* this.attackMultiple);
            this.monsterHealth = this.monsterHealth - point;
            this.addToLog({turn: "p", text: this.logText.attack + point });
            this.monsterAttack();
           
        },
        specialAttack: function(){
            const point = Math.ceil(Math.random()* this.specialAttackMultiple);
            this.monsterHealth = this.monsterHealth - point;
            this.addToLog({turn: "p", text: this.logText.specialAttack + point });
            this.monsterAttack();
          
        },
        firstAid: function(){
            const point = Math.ceil(Math.random()* this.firstAidMultiple);
            this.playerHealth = this.playerHealth + point;
            this.addToLog({turn: "p", text: this.logText.firstAid + point });
            this.monsterAttack();
           
        },
        giveUp: function(){
            this.playerHealth = 0;
            this.addToLog({turn: "p", text: this.logText.giveUp});
            

        },
        monsterAttack: function(){
            const point = Math.ceil(Math.random()*this.monsterAttackMultiple);
            this.playerHealth = this.playerHealth - point;
            this.addToLog({turn: "m", text: this.logText.monsterAttack + point })
            
        },
        addToLog: function(log){
            this.logs.push(log);
        }
    },
    watch: {
        playerHealth : function(value){
            if(value<=0){
                this.playerHealth = 0;
                if(confirm("OYUNU KAYBETTİN.TEKRAR DENEMEK İSTER MİSİN")){
                    this.playerHealth = 100;
                    this.monsterHealth = 100;
                    this.logs = [];
                }
            }else if(value>=100){
                this.playerHealth = 100;
            }
        },
        monsterHealth : function(value){
            if(value<=0){
                this.monsterHealth = 0;
                if(confirm("OYUNU KAZANDIN.TEKRAR DENEMEK İSTER MİSİN")){
                    this.playerHealth = 100;
                    this.monsterHealth = 100;
                    this.logs = [];
                }
            }else if(value>=100){
                this.monsterHealth = 100;
            }
        }
    },
    computed: {
        playerProgress: function(){
            return {
                width: this.playerHealth + "%"
            }
        },
        monsterProgress: function(){
            return {
                width: this.monsterHealth + "%"
            }
        }
    }

})