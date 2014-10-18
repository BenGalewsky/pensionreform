PC.Utils.asyncLoad(['controller.js', 'dataItem.js', 'systems/mortality.js', 'systems/active.js'], function() {
	
	if (!('state' in PC.hashVars)) throw new Error('No state defined in hash.');
	if (!(PC.hashVars.state in PC.stateNames)) throw new Error('Unknown state');
	var stateID = PC.hashVars.state;
	//if (!PC.isActive[stateID]) throw new Error("State '" + PC.stateNames[stateID] + "' is not active");
	

	PC.Utils.asyncLoad(['/libs/YUI/animation.js', 'systems/dataItems.js', 'widgets/single.css', 'systems/states/' + PC.hashVars.state + '.js'], function() {
	
		var PAGE_WIDTH = 442;
		var DURATIONS = {
			SCROLL: 0.5,
			HINT: 0.2,
			ERROR: 0.2
		};
		
		var borderColors = ['#6b1d1d', '#1d1d6b', '#1d6b1d', '#525252', '#6e9a6e', '#235ad5', '#66198a', '#d58c23'];
		
		var div = document.createElement("div");
		if ('borderColor' in PC.hashVars) {
			var bc = parseInt(PC.hashVars.borderColor);
			div.style.backgroundColor = (isNaN(bc)) ? PC.hashVars.borderColor : borderColors[bc];
		}
		
		var title = document.createElement("div");
		title.className = 'PC.title';
		title.appendChild(document.createTextNode('Public Pension Calculator'));
		div.appendChild(title);
		
		var body = document.createElement("div");
		body.className = 'PC.body';
		div.appendChild(body);
		
		var shelf = document.createElement("div");
		shelf.className = 'PC.shelf';
		body.appendChild(shelf);
		
		
		var hint = document.createElement('div');
		hint.id = 'PC.hint';
	
		var hintShown = false;
		
		var _showHintAnim = new YAHOO.util.Anim(hint, { opacity: { to: 1 } }, DURATIONS.HINT, YAHOO.util.Easing.easeOut);
		function showHint(title, text) {
			if (hintShown) return;
			hintTitle.innerHTML = title;
			hintText.innerHTML = text;
			hint.style.display = 'block';
			hintShown = true;
			_showHintAnim.animate();
		}
		
		var _hideHintAnim = new YAHOO.util.Anim(hint, { opacity: { to: 0 } }, DURATIONS.HINT, YAHOO.util.Easing.easeOut);
		_hideHintAnim.onComplete.subscribe(function() { hint.style.display = 'none'; });
		function hideHint() {
			if (!hintShown) return;
			hintShown = false;
			_hideHintAnim.animate();
		}
		
		PC.Utils.addEvent(document, "keydown", function(e) {
			var keyCode = (window.event) ? window.event.keyCode : e.which;
			if (keyCode == 27) hideHint();
		});
		
		var hintBody = document.createElement('div');
		hint.appendChild(hintBody);
	
		var hintTitle = document.createElement('div');
		hintTitle.id = 'PC.hintTitle';
		
		hintBody.appendChild(hintTitle);
		
		var hintText = document.createElement('div');
		hintText.id = 'PC.hintText';
		hintBody.appendChild(hintText);
		
		var hintClose = document.createElement('div');
		hintClose.id = 'PC.hintClose';
		hintClose.onclick = hideHint;
		hint.appendChild(hintClose);
	
		body.appendChild(hint);
		
		
		function scrollTo(newLeft, callback) {
			hideHint();
			var anim = new YAHOO.util.Anim(shelf, { left: { to: newLeft } }, DURATIONS.SCROLL, YAHOO.util.Easing.easeOut);
			if (callback) anim.onComplete.subscribe(callback);
			anim.animate();
		}
		
		function scrollBy(amount, callback) {
			var newLeft = parseInt(shelf.style.left) || 0;
			newLeft += amount;
			scrollTo(newLeft, callback)
		}
		
		function scrollForward(callback) {
			scrollBy(-PAGE_WIDTH, callback);
		}
		
		function scrollBackward(callback) {
			scrollBy(PAGE_WIDTH, callback);
		}
		
		function scrollCompletelyBackward(callback) {
			scrollTo(0, callback);
		}
		
		function createQuestionPage(first, questionObj) {
			var page = document.createElement("div");
			page.className = 'PC.page';
			
			var questionHolder = document.createElement('div');
			questionHolder.className = 'PC.questionHolder';
			var middleDiv = document.createElement('div');
			questionHolder.appendChild(middleDiv);
			var innerDiv = document.createElement('div');
			middleDiv.appendChild(innerDiv);
			
			var question = document.createElement('div');
			question.className = 'PC.question';
			question.innerHTML = questionObj.getQuestion();
			innerDiv.appendChild(question);
			
			var hint = questionObj.getHint(stateID);
			if (hint) {
				var moreInfoIcon = document.createElement('div');
				moreInfoIcon.className = 'PC.moreInfoIcon';
				moreInfoIcon.onclick = function() {;
					showHint(questionObj.getName(), hint);
				};
				question.appendChild(moreInfoIcon);
			}
			
			var answer = document.createElement('div');
			answer.className = 'PC.answer';
			questionObj.attach(answer);
			innerDiv.appendChild(answer);
			
			var error = document.createElement('div');
			error.className = 'PC.error';
			innerDiv.appendChild(error);
		
			page.appendChild(questionHolder);
			
			var buttonHolder = document.createElement("div");
			buttonHolder.className = 'PC.buttonHolder';
			if (!first) {
				var previousButton = document.createElement("input");
				previousButton.type = 'button';
				previousButton.className = 'PC.input.button PC.previousButton';
				previousButton.value = '‹ Go Back';
				previousButton.onclick = function() {
					scrollBackward(function() {
						clearLast();
					});
				};
				buttonHolder.appendChild(previousButton);
			}
			var nextButton = document.createElement("input");
			nextButton.type = 'button';
			nextButton.className = 'PC.input.button PC.nextButton';
			nextButton.value = 'Continue ›';
			
			function showError(message) {
				function doShowError() {
					error.style.visiblity = "hidden";
					error.style.position = "absolute";
					error.style.height = "auto";
					error.innerHTML = message;
					var errorHeight = error.scrollHeight;
					error.style.height = "0px";
					error.style.visibility = "visible";
					error.style.position = "static";
					var showErrorAnim = new YAHOO.util.Anim(error, { height: { to: errorHeight }, paddingTop: { to: 12 }, opacity: { from: 0, to: 1 } }, DURATIONS.ERROR, YAHOO.util.Easing.easeOut);
					showErrorAnim.animate();
				}
				if (parseInt(error.style.height)) {
					hideError(doShowError);
				} else {
					doShowError();
				}
			}
	
			function hideError(callback) {
				var hideErrorAnim = new YAHOO.util.Anim(error, { height: { to: 0 }, paddingTop: { to: 0 }, opacity: { to: 0 } }, DURATIONS.ERROR, YAHOO.util.Easing.easeOut);
				if (callback) hideErrorAnim.onComplete.subscribe(callback);
				hideErrorAnim.animate();
			}
			
			nextButton.onclick = function() {
				var error = questionObj.process(); 
				if (!error) {
					hideError();
					if (PC.QuestionController.moreQuestions()) {
						var nextQuestion = PC.QuestionController.next();
						createQuestionPage(false, nextQuestion);
					} else {
						var results = PC.QuestionController.getResults();
						createSummaryPage(results[stateID]);
					}
					scrollForward();
				} else {
					showError(error);	
				}
			}
			
			buttonHolder.appendChild(nextButton);
			page.appendChild(buttonHolder);
			
			var credit = document.createElement('div');
			credit.className = 'PC.credit'
			credit.innerHTML = "Sponsored by the Manhattan Institute's <a href='http://publicsectorinc.org/' target='_blank'>Public Sector Inc</a>.";
			page.appendChild(credit);
			
			shelf.style.width = ( PAGE_WIDTH * (shelf.children.length + 2) ) + 'px';
			shelf.appendChild(page);
		}
		
		function createSummaryPage(results) {
			
			var summaryPage = document.createElement("div");
			summaryPage.className = 'PC.page';
			
			var summaryTable = document.createElement("table");
			summaryTable.className = 'PC.summary';
			summaryPage.appendChild(summaryTable);
			
			if (results.error) {
				createSummaryErrorPage(summaryTable, results.error);
			} else {
				createSummaryResultsPage(summaryTable, results);
			}
			
			var buttonRow = summaryTable.insertRow(-1);
			var buttonCell = buttonRow.insertCell(-1);
			
			var previousButton = document.createElement("input");
			previousButton.type = 'button';
			previousButton.className = 'PC.input.button PC.previousButton';
			previousButton.value = '‹ Go Back';
			previousButton.onclick = function() {
				scrollBackward(function() {
					clearLast();
				});
			};;
			buttonCell.appendChild(previousButton);
			
			var startOverButton = document.createElement('input');
			startOverButton.type = 'button';
			startOverButton.value = '« Start Over'
			startOverButton.className = 'PC.input.button PC.startOverButton';
			startOverButton.onclick = function() {
				scrollCompletelyBackward(function() {
					clearAfter(shelf.firstChild);
				});
			};
			buttonCell.appendChild(startOverButton);
			
			var logoRow = summaryTable.insertRow(-1);
			var logoCell = logoRow.insertCell(-1);
			
			var logoLink = document.createElement('a');
			logoLink.href = 'http://publicsectorinc.org/';
			logoLink.target = '_blank';
			logoCell.appendChild(logoLink);
			
			var logo = document.createElement('img');
			logo.src = PC.baseURL + 'images/logo.png';
			logo.className = 'PC.logo';
			logoLink.appendChild(logo);
	
			shelf.appendChild(summaryPage);
		}
		
		
		function createSummaryErrorPage(summaryTable, message) {
			var errorRow = summaryTable.insertRow(-1);
			var errorCell = errorRow.insertCell(-1);
			errorCell.className = 'PC.resultsError';
			errorCell.appendChild(document.createTextNode(message));
		}
		
		
		function createSummaryResultsPage(summaryTable, results) {
	
			var pensionRow = summaryTable.insertRow(-1);
			var pensionCell = pensionRow.insertCell(-1);
			
			var pensionTable = document.createElement("table");
			pensionTable.className = 'PC.results';
			pensionCell.appendChild(pensionTable);
			
			var pensionHeaderRow = pensionTable.insertRow(-1);
			var pensionHeaderCell = document.createElement('th');
			pensionHeaderCell.className = 'PC.header';
			pensionHeaderCell.colSpan = 2;
			pensionHeaderCell.appendChild(document.createTextNode('Your Pension Benefit'));
			pensionHeaderRow.appendChild(pensionHeaderCell);
			
			var pensionMonthlyRow = pensionTable.insertRow(-1);
			var pensionMonthlyHeaderCell = document.createElement('th')
			pensionMonthlyHeaderCell.appendChild(document.createTextNode('Monthly:'));
			pensionMonthlyRow.appendChild(pensionMonthlyHeaderCell);
			var pensionMonthlyValueCell = document.createElement('td')
			pensionMonthlyValueCell.appendChild(document.createTextNode(results.monthlyPension));
			pensionMonthlyRow.appendChild(pensionMonthlyValueCell);
			
			var pensionAnnualRow = pensionTable.insertRow(-1);
			var pensionAnnualHeaderCell = document.createElement('th')
			pensionAnnualHeaderCell.appendChild(document.createTextNode('Annual:'));
			pensionAnnualRow.appendChild(pensionAnnualHeaderCell);
			var pensionAnnualValueCell = document.createElement('td')
			pensionAnnualValueCell.appendChild(document.createTextNode(results.annualPension));
			pensionAnnualRow.appendChild(pensionAnnualValueCell);
			
			
			var annuityRow = summaryTable.insertRow(-1);
			var annuityCell = annuityRow.insertCell(-1);
			
			var annuityTable = document.createElement("table");
			annuityTable.className = 'PC.results';
			annuityCell.appendChild(annuityTable);
			
			var annuityHeaderRow = annuityTable.insertRow(-1);
			var annuityHeaderCell = document.createElement('th');
			annuityHeaderCell.className = 'PC.header';
			annuityHeaderCell.colSpan = 2;
			annuityHeaderCell.appendChild(document.createTextNode('Your Lifetime Annuity'));
			var moreInfoIcon = document.createElement('div');
			moreInfoIcon.className = 'PC.moreInfoIcon';
                        var COLAtxt = PC.globalHints.annuityCost; 
                        var info = COLAtxt[1];
                        if ("info" in PC.systems[stateID].COLA) info += '<br /><br />' + PC.systems[stateID].COLA.info;
			moreInfoIcon.onclick = function() {
				showHint(COLAtxt[0], info);
			}
			annuityHeaderCell.appendChild(moreInfoIcon);
			annuityHeaderRow.appendChild(annuityHeaderCell);
			
            var annuityTextRow = annuityTable.insertRow(-1);
            var annuityTextCell = document.createElement('td');
            //annuityHeaderCell.className = 'PC.header';
            annuityTextCell.style.fontSize = "smaller";
            annuityTextCell.style.textAlign = "center";
            annuityTextCell.colSpan = 2;
            annuityTextCell.appendChild(document.createTextNode('The amount of cash you would need at the same retirement age to yield the same annual income as this public pension.'));
            annuityTextRow.appendChild(annuityTextCell);
            
			var annuityMonthlyRow = annuityTable.insertRow(-1);
			var annuityMonthlyHeaderCell = document.createElement('th')
			annuityMonthlyHeaderCell.appendChild(document.createTextNode('Male:'));
			annuityMonthlyRow.appendChild(annuityMonthlyHeaderCell);
			var annuityMonthlyValueCell = document.createElement('td')
			annuityMonthlyValueCell.appendChild(document.createTextNode(results.maleAnnuity));
			annuityMonthlyRow.appendChild(annuityMonthlyValueCell);
			
			var annuityAnnualRow = annuityTable.insertRow(-1);
			var annuityAnnualHeaderCell = document.createElement('th')
			annuityAnnualHeaderCell.appendChild(document.createTextNode('Female:'));
			annuityAnnualRow.appendChild(annuityAnnualHeaderCell);
			var annuityAnnualValueCell = document.createElement('td')
			annuityAnnualValueCell.appendChild(document.createTextNode(results.femaleAnnuity));
			annuityAnnualRow.appendChild(annuityAnnualValueCell);
	
		}
	
		function clearAfter(obj) {
			for (var i = shelf.childNodes.length - 1; i >= 0; i--) {
				var node = shelf.childNodes[i];
				if (node == obj) break;
				shelf.removeChild(node);
			}
			PC.QuestionController.setCurrent(shelf.childNodes.length);
		}
		
		function clearLast() {
			shelf.removeChild(shelf.childNodes[shelf.childNodes.length-1]);
			PC.QuestionController.setCurrent(shelf.childNodes.length);
		}
		
		PC.QuestionController.init(PC.hashVars.state);
		
		createQuestionPage(true, PC.QuestionController.next());
		
		PC.target.appendChild(div);
		
	}); 
});
