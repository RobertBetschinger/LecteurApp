function init(minutes) {
	console.log('init');
	var time_in_minutes = minutes;
	start_countdown('div_clock', time_in_minutes);
}

function start_countdown(clockid, time_in_minutes) {
	console.log("start_countdown");
	//start the countdown
	var current_time = Date.parse(new Date());
	var deadline = new Date(current_time + time_in_minutes * 60 * 1000);
	run_clock(clockid, deadline);
}

function run_clock(id, endtime) {
	console.log("run_clock");
	var clock = document.getElementById(id);
	function update_clock() {
		var t = time_remaining(endtime);
		clock.innerHTML = ((t.minutes).toString()).padStart(2, '0') + ':' + ((t.seconds).toString()).padStart(2, '0');
		if (t.total <= 0) {
			alert("Zeit abgelaufen")
			clearInterval(timeinterval);		
		}
	}
	update_clock(); // run function once at first to avoid delay
	var timeinterval = setInterval(update_clock, 1000);
}

function time_remaining(endtime) {
	console.log("time_remaining")
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return { 'total': t, 'days': days, 'hours': hours, 'minutes': minutes, 'seconds': seconds };
}

