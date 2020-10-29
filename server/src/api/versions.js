import express from "express";
import Model from "../Model"

export default class Version {
	constructor(app) {
		this.app = app;
		this.router = express.Router();

		this.router.get("/", async (req, res) => {
			Model.getVersions()
				.then((result) => {
					res.json({success: true, got: result});
				})
				.catch((err) => {
					res.json({success: false, error: err})
				});
		});
		
		this.router.get("/:id", async(req, res) => {
			const id = req.params.id;
			Model.getVersion(id)
				.then((result) => {
					res.json({success: true, got: result});
				})
				.catch((err) => {
					res.json({success: false, error: err});
				});
		});
		
		this.router.get("/fromMonitor/:id", async(req, res) => {
			const id = req.params.id;
			Model.getVersionsOfMonitor(id)
				.then((result) => {
					res.json({success: true, got: result});
				})
				.catch((err) => {
					res.status(500).json({success: false, error: err});
				});
		});
		
		this.router.post("/", async (req,res) => {
			const version = {monitor_id: req.body.monitor_id, value: req.body.value, discovery_timestamp: req.body.discovery_timestamp};
			Model.createVersion(version.monitor_id, version.value, version.discovery_timestamp)
				.then((result) => {
					this.app.reloadMonitor(version.monitor_id);
					res.json({success: true, posted: result});
				})
				.catch((err) => {
					res.status(500).json({success: false, error: err});
				});
		});
		
		this.router.patch("/:id", async (req, res) => {
			const id = req.params.id;
			const version = {value: req.body.value, discovery_timestamp: req.body.discovery_timestamp};
			Model.modifyVersion(id, version.value, version.discovery_timestamp)
				.then((result) => {
					this.app.reloadMonitor(version.monitor_id);
					res.json({success: true, updated: result})
				})
				.catch((err) => {
					res.status(500).json({success: false, error: err})
				});
		});
		
		this.router.delete("/:id", async (req, res) => {
			const id = req.params.id;
			Model.deleteVersion(id)
				.then((result) => {
					this.app.reloadMonitor(result.monitor_id);
					res.json({success: true, deleted: result});
				})
				.catch((err) => {
					res.status(500).json({success: false, error: err});
				});
		});
	}
};