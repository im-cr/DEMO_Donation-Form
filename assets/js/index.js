const donationForm = document.querySelector('#donorForm');
const donationAmount = document.querySelector('.donation__input');
const donationError = document.querySelector('.donor-error');
const progressBar = document.querySelector('#donor__progress');
const progressLabel = document.querySelector('.label__progress');
const donorLead = document.querySelector('.donor-lead');
const donorCount = document.querySelector('.donor-count');
const donorGoal = document.querySelector('.donor-goal');
const donorMarker = document.querySelector('.marker');
const modal = document.querySelector('.modal');
const clearBtn = document.querySelector('.btn.clear');
let modalShow = localStorage.getItem('modal') || '';

// global constants
const DONATION_GOAL = 5000;
const DAYSTART = new Date('09/29/2020');
const DAYEND = new Date('10/03/2020');


loadEventListeners();

function loadEventListeners(){

	// On load get all check and get donations
	document.addEventListener('DOMContentLoaded', () => {
		donationCheck();
		updateDonations();
		getDays();
	});

	// Add Donation on form submit
	donationForm.addEventListener('submit', addDonation);

	// clear local storage
	clearBtn.addEventListener('click', clearStorage);
}




function addDonation(e){
	e.preventDefault();

	//get input value
	let amount = parseInt(donationAmount.value);
	
	// check input value
	if(!isNaN(amount) && amount != '' && amount > 5){
		
			// store input value
			storeDonations(amount);

			// reset form
			if(donationError){
				donationError.classList.remove('visible');
				donationAmount.classList.remove('error');
			}
			donationForm.reset();
		
	} else {
		donationError.classList.add('visible');
		donationError.innerText = 'Sorry this donation is not valid. Please make a minimum donation of $5 dollars.';
		donationAmount.classList.add('error');
	}
	
}

function storeDonations(donation){
	let donations = donationCheck();

	// store donations in LS
	donations.push(donation);
	localStorage.setItem('donations', JSON.stringify(donations));

	// calcuate total donations
	updateDonations();
}


function donationTotal(){
	let donations = donationCheck();	

	// dont add if array is empty
	if(donations.length == 0){
		return;
	}

	const totalDonations = donations.reduce( (a,b) => {
		return parseFloat(a + b);
	});

	return totalDonations;
}



function updateDonations(){
	let donations = donationCheck();
	const total = donationTotal();	


	// Add donations to progress bar
	progressBar.setAttribute('value', total);

	// update donor count text
	donorCount.innerText = getDonors();

	//update donations amount text
	if(donations.length == 0){
		donorLead.classList.add('visible');
		donorGoal.innerText = DONATION_GOAL;
	} else {
		// configure marker position
		const leftPosition = (total / DONATION_GOAL) * 100 - 1.5 + "%" ;
		donorMarker.style.left = (leftPosition < "1%") ? "1%" : leftPosition;
		donorLead.classList.remove('visible');

		// format donation amount
		donorGoal.innerText = parseInt(DONATION_GOAL - total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
	}

	if(total >= DONATION_GOAL){
		donorMarker.style.display = 'none';
		progressLabel.classList.add('success');
		progressLabel.innerHTML =`
			Hooray! We did it! We've raised 
			<span>$${total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span> dollars.
			Keep going!
		`;

		// show celebration modal once when goal is reached
		if(modalShow !== 'true'){					

			modal.classList.add('visible');
			
			setTimeout(function(){
				modal.style.opacity = '0';								
			}, 2200);

			setTimeout(function(){
				modal.classList.remove('visible');
				modal.classList.add('shown');
			},3000);						
			
			localStorage.setItem('modal', true);
		}	
			
	}
	
	// console.log(total);
}

// quick grab of number of donations
function getDonors(){
	let donations = donationCheck();	
	
	return donations.length;
}

// check ls item exists or make array
function donationCheck(){
	let donations;

	if(localStorage.getItem("donations") === null ){
		donations = [];
	} else {
		donations = JSON.parse(localStorage.getItem('donations'));
	}

	return donations;
}

// calculate days for project
function getDays(){
	const submitBtn = document.querySelector('.btn.submit');
	const donorDay = document.querySelector('.donor-days');
	const days = (DAYEND.getTime() - DAYSTART.getTime()) / (1000 * 3600 * 24);

	donorDay.innerText = days;

	// disable form elements and update progress label if project closed
	if(days == 0){
		donationAmount.disabled = true;
		submitBtn.disabled = true;
		progressLabel.classList.add('closed')
		progressLabel.innerText = 'Sorry, this project is closed';
	}
}


// LS clear function
function clearStorage(){
	localStorage.clear();
	location.reload();
}
