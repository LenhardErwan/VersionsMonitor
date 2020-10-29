import express from "express";
import Model from "../Model";
import Monitor from "../templates/monitor";

export default class Monitors {
  constructor(app) {
		this.app = app;
    this.router = express.Router();

    this.router.get("/", async (req, res, next) => {
      Model.getMonitors()
        .then((result) => {
          res.json({ success: true, got: result });
        })
        .catch((err) => {
          res.json({ error: err });
        });
    });

    this.router.get("/:id", async (req, res) => {
      const id = req.params.id;
      Model.getMonitor(id)
        .then((result) => {
          res.json({ success: true, got: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
		});
		
		this.router.post("/:id/check", async (req, res) => {
			const id = req.params.id;
			try {
				await this.app.checkAndReload(id);
				const result = await Model.getMonitor(id);
				res.json({ success: true, got: result });
			}
			catch (err) {
				res.status(500).json({ success: false, error: err });
			}
    });

    this.router.post("/", async (req, res) => {
      const monitor = new Monitor(req.body);
      Model.createMonitor(monitor)
        .then(async (result) => {
					try {
						await this.app.checkAndReload(result.monitor.id);
						const res_v = await Model.getVersionsOfMonitor(result.monitor.id);
						if(res_v.length <= 0) throw "No version found";
						result.versions = res_v;
						res.json({ success: true, posted: result });
					} 
					catch(err) {
						res.status(500).json({ success: false, error: err });
					}
					
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
    });

    this.router.patch("/:id", async (req, res) => {
      const id = req.params.id;
      //Prevents the addition of new properties but allows to dynamically generate a query without the possibility of SQL injection.
			const monitor = new Monitor(req.body, { patch: true });
      const map = new Map();
      for (const property in monitor) {
        map.set(property, monitor[property]);
			}

      Model.modifyMonitor(id, map)
			.then(async (result) => {
				try {
					await this.app.checkAndReload(result.id);
					const res_v = await Model.getVersionsOfMonitor(result.id);
					if(res_v.length <= 0) throw "No version found";
					result.versions = res_v;
					res.json({ success: true, updated: result });
				} 
				catch(err) {
					res.status(500).json({ success: false, error: err });
				}
				
			})
			.catch((err) => {
				res.status(500).json({ success: false, error: err });
			});
    });

    this.router.delete("/:id", async (req, res) => {
      const id = req.params.id;
      Model.deleteMonitor(id)
        .then((result) => {
					this.app.deleteMonitor(result.id);
          res.json({ success: true, deleted: result });
        })
        .catch((err) => {
          res.status(500).json({ success: false, error: err });
        });
    });

    this.router.post("/:monitor_id/headers", async (req, res) => {
      const m_id = req.params.monitor_id;
      const header = { title: req.body.title, value: req.body.value };

      Model.createAndLinkHeader(header, m_id)
        .then((result) => {
					try {
						this.app.checkAndReload(m_id);
						res.json({ success: true, posted: result });
					}
					catch (err) {
						res.status(500).json({ success: false, error: err });
					}
        })
        .catch((err) => {
          res.status(400).json({ success: false, error: err });
        });
    });

    this.router.post("/:monitor_id/headers/:header_id", async (req, res) => {
      const m_id = req.params.monitor_id;
      const h_id = req.params.header_id;

      Model.linkMonitorHeader(m_id, h_id)
        .then(async (result) => {
					try {
						await this.app.checkAndReload(m_id);
          	res.json({ success: true });
					}
					catch (err) {
						res.status(500).json({ success: false, error: err });
					}
        })
        .catch((err) => {
          res.status(400).json({ success: false, error: err });
        });
    });

    this.router.delete("/:monitor_id/headers/:header_id", async (req, res) => {
      const m_id = req.params.monitor_id;
      const h_id = req.params.header_id;

      Model.unlinkMonitorHeader(m_id, h_id)
        .then(async (result) => {
					try {
						await this.app.checkAndReload(m_id);
          	res.json({ success: true });
					}
					catch (err) {
						res.status(500).json({ success: false, error: err });
					}
        })
        .catch((err) => {
          res.status(400).json({ success: false, error: err });
        });
    });
	}
}
