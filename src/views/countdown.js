import React, { Component } from "react";
import "./countdown.css";
import Api from "../api";

class Countdown extends Component {
	constructor() {
		super();

		this.state = {
			days: 0,
			hours: 0,
			min: 0,
			sec: 0,
			endDate: null,
			tournamentName: "hej",
			estDate: "somedate",
		};
	}

	componentDidMount() {
		Api.getNextTournament((tournamentInfo) => {
			console.log(Date.parse(new Date()) - -60 * 60 * 1000 + 1000 * tournamentInfo["secondsUntil"]);
			const d = new Date();
			console.log(tournamentInfo["secondsUntil"]);
			console.log(
				"deadline: " + new Date(Date.parse(new Date()) - 0 * 60 * 1000 + 1000 * tournamentInfo["secondsUntil"])
			);
			console.log(d.getTimezoneOffset());
			this.setState({
				endDate: new Date(Date.parse(new Date()) - 0 * 60 * 1000 + 1000 * tournamentInfo["secondsUntil"]),
				tournamentName: tournamentInfo["tournamentName"],
				estDate: tournamentInfo["estDateStr"],
			});
			const date = this.calculateCountdown(this.state.endDate);
			date ? this.setState(date) : this.stop();
			this.interval = setInterval(() => {
				const date = this.calculateCountdown(this.state.endDate);
				date ? this.setState(date) : this.stop();
			}, 1000);
		});
	}

	componentWillUnmount() {
		this.stop();
	}

	calculateCountdown(endDate) {
		let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

		// clear countdown when date is reached
		if (diff <= 0) return false;

		const timeLeft = {
			years: 0,
			days: 0,
			hours: 0,
			min: 0,
			sec: 0,
			millisec: 0,
		};

		// calculate time difference between now and expected date
		if (diff >= 365.25 * 86400) {
			// 365.25 * 24 * 60 * 60
			timeLeft.years = Math.floor(diff / (365.25 * 86400));
			diff -= timeLeft.years * 365.25 * 86400;
		}
		if (diff >= 86400) {
			// 24 * 60 * 60
			timeLeft.days = Math.floor(diff / 86400);
			diff -= timeLeft.days * 86400;
		}
		if (diff >= 3600) {
			// 60 * 60
			timeLeft.hours = Math.floor(diff / 3600);
			diff -= timeLeft.hours * 3600;
		}
		if (diff >= 60) {
			timeLeft.min = Math.floor(diff / 60);
			diff -= timeLeft.min * 60;
		}
		timeLeft.sec = diff;
		return timeLeft;
	}

	stop() {
		clearInterval(this.interval);
	}

	addLeadingZeros(value) {
		value = String(value);
		while (value.length < 2) {
			value = "0" + value;
		}
		return value;
	}

	render() {
		const countDown = this.state;
		let title = "Submission Deadline in";
		if (this.state.tournamentName === "START") {
			title = "Game Specs are now released!";
		}
		// TODO choosing which one to display should really be dynamic
		let explanatoryText = (
			<div>
				The submission deadline for <b>{this.state.tournamentName}</b> is at <b>{this.state.estDate}</b>.
			</div>
		);
		let countdown = (
			<div className="countdown-container">
				<div className="Countdown">
					<span className="Countdown-col">
						<span className="Countdown-col-element">
							<strong>{this.addLeadingZeros(countDown.days)}</strong>
							<span>{countDown.days === 1 ? "Day" : "Days"}</span>
						</span>
					</span>
					<span className="Countdown-col">
						<span className="Countdown-col-element">
							<strong>{this.addLeadingZeros(countDown.hours)}</strong>
							<span>{countDown.hours === 1 ? "Hour" : "Hours"}</span>
						</span>
					</span>
					<span className="Countdown-col">
						<span className="Countdown-col-element">
							<strong>{this.addLeadingZeros(countDown.min)}</strong>
							<span>Min</span>
						</span>
					</span>
					<span className="Countdown-col">
						<span className="Countdown-col-element">
							<strong>{this.addLeadingZeros(countDown.sec)}</strong>
							<span>Sec</span>
						</span>
					</span>
				</div>
			</div>
		);
		if (this.state.tournamentName === "START") {
			explanatoryText = (
				<div>
					Specifications are avaliable in the resources tab. Be sure to look at the getting started section for
					information on how to get the game and your first bot running!{" "}
				</div>
			);
			countdown = null;
		}
		return (
			<div className="card ">
				<div className="header">
					<h4 className="title">{title}</h4>
				</div>
				<div className="content">
					{countdown}
					{explanatoryText}
				</div>
			</div>
		);
	}
}

export default Countdown;
