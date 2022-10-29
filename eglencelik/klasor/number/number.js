var counter = 1,
			totalNumbers = 0,
			numArr = [],
			timerHandleID = -1,
			lastTime = 0;
			sec = 0,
			check_time = 0;
			startLock = false,
			initiated = false;

		var restartEl, counterEl, numberToFindEl, blocksEl;

		function loadElementRefs() {
			if( initiated )
				return
			restartEl = document.querySelector('#restart');
			counterEl = document.querySelector('#counter');
			numberToFindEl = document.querySelector('#numberToFind');
			blocksEl = document.querySelector('#blocks');
			initiated = true;
		}

		function numberArray(mat) {
			var tn = 2*Math.pow(mat, 2);
			totalNumbers = tn;
			for(var i=0;i<tn;i++) {
				numArr.push(i+1);
			}
		}

		function nextRandom() {
			var rn = numArr[0];
			numArr.splice(0, 1);
			return rn;
		}

		function shuffle(array, pos) {
		  var currentIndex = (pos || array.length), temporaryValue, randomIndex;

		  while (0 !== currentIndex) {

		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}

		function clickHandler(e) {

			if(sec === 0) {
				lastTime = new Date().getTime();
				timer();
				restartEl.style.display = '';
				startLock = false;
			}

			if(counter === Number(e.currentTarget.innerText)) {
				check_time = new Date().getTime();
				e.currentTarget.classList.remove('border');
				if(numArr.length === 0) {
					e.currentTarget.removeEventListener('click', clickHandler);
					var blocks = blocksEl 
					blocks.removeChild(e.currentTarget);
					counter++;

					if(counter > totalNumbers) {
						clearInterval(timerHandleID);
						counter = 1;
						restartEl.style.display = '';
						numberToFindEl.style.display = 'none';
						return;
					}
					numberToFindEl.innerHTML = counter;
					return;
				}

				var nextNumber = nextRandom();
				e.currentTarget.style.backgroundColor = '#aaaaaa';
				e.currentTarget.innerHTML = nextNumber 
				counter++;

				e.currentTarget.id = 'block_' + nextNumber;
				numberToFindEl.innerHTML = counter;
			}
		}

		function block(n, x, y) {
			var _ = document.createElement('div');
			_.className = 'block';
			_.style.top = y + 'px';
			_.style.left = x + 'px';
			_.innerHTML = n;
			_.id = 'block_' + n;
			_.addEventListener('click', clickHandler);
			return _;
		}

		function blocks(mat, margin) {
			numArr = [];
			numberArray(mat);
			numArr = shuffle(numArr, numArr.length/2);

			var blocks = blocksEl
			blocks.style.width = (100*mat + margin*mat) + 'px'
			blocks.style.height = (100*mat + margin*mat) + 'px'

			margin = margin || 1;
			var x = margin, y = margin, c = 0;
			for(var i=0;i<mat;i++) {
				x = margin;
				for(var k=0;k<mat;k++) {
					blocks.appendChild(block(nextRandom(), x, y));
					x += (100 + margin);
				}
				y += (100 + margin);
			}
			numArr = shuffle(numArr);
		}

		function clearBlocks() {
			var blks = document.body.querySelectorAll('.block');
			blks = [].slice.call(blks);
			for(var key in blks) {
				blks[key].parentElement.removeChild(blks[key]);
			}
		}

		function timer() {
			timerHandleID = setInterval(function () {
				var cT = new Date().getTime();
				sec = ((cT - lastTime)/1000);
				if(cT - check_time >= 3000) {
					document.querySelector('#block_' + counter).classList.add('border');
				}
				counterEl.innerHTML = sec.toFixed(4);
			}, 1);
		}

		function restart(mat) {

			loadElementRefs()

			if(startLock)
				return;

			sec = 0;
			counter = 1;
			counterEl.innerHTML = '0.0000';
			numberToFindEl.innerHTML = counter;
			restartEl.style.display = 'none';
			numberToFindEl.style.display = '';
			clearInterval(timerHandleID);
			clearBlocks();
			blocks(mat || 2, 20);

			startLock=true;
		}