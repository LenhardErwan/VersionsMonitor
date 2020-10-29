export default {
  openapi: "3.0.1",
  info: {
    title: "versions-monitor",
    version: "1.1.0",
    license: {
      name: "GPL-3.0",
    },
    description:
      "Monitoring interface for the latest versions of any software or applications",
  },
  servers: [
    {
      url: "http://localhost:8012/",
      description: "Local server",
    },
  ],
  components: {
		schemas: {
			monitor: {
				allOf: [
					{
						"$ref": "#/components/hiddenSchemas/monitorAlone"
					},
					{
						type: "object",
						properties: {
							
							versions: {
								type: "array",
								items: {
									"$ref": "#/components/hiddenSchemas/version",
								},
								description:
									"Known versions of the monitored application (first is newest)",
							},
							headers: {
								type: "array",
								items: {
									"$ref": "#/components/hiddenSchemas/header",
								},
								description:
									"headers needed to load a page generated according to them",
							}
						}
					}
				]
			},
			header: {
				allOf: [
					{
						"$ref": "#/components/hiddenSchemas/header"
					}
				]
			},
			version: {
				allOf: [
					{
						"$ref": "#/components/hiddenSchemas/versionAlone"
					}
				]
			}
		},
    hiddenSchemas: {
      monitor: {
				allOf: [
					{
						"$ref": "#/components/hiddenSchemas/monitorAlone"
					},
					{
						type: "object",
						properties: {
							versions: {
								type: "array",
								items: {
									"$ref": "#/components/hiddenSchemas/version",
								}
							},
							headers: {
								type: "array",
								items: {
									"$ref": "#/components/hiddenSchemas/header",
								}
							}
						}
					}
				]
			},
			header: {
        type: "object",
        properties: {
          id: {
						type: "integer",
						description: "The header ID"
          },
          title: {
						type: "string",
						description: "The header title"
          },
          value: {
						type: "string",
						description: "The header value"
          },
        },
      },
      version: {
        type: "object",
        properties: {
          id: {
						type: "integer",
						description: "The version ID"
          },
          value: {
						type: "string",
						description: "The value of the version"
          },
          discovery_timestamp: {
						type: "date",
						description: "The date when the version was found"
          }
        }
			},
			monitorAlone: {
				type: "object",
        properties: {
          id: {
            type: "integer",
            description: "The monitor ID",
          },
          name: {
            type: "string",
            description: "The monitor name",
          },
          url: {
            type: "string",
            description: "URL to the page where the version is located",
          },
          selector: {
            type: "string",
            description:
              "CSS Selector that points to the tag that contains the version",
          },
          regex: {
            type: "string",
            description: "Regex which allows to refine the result if necessary",
          },
          image: {
            type: "string",
            description: "URL to image of application",
					}
				}
			},
			versionAlone: {
				allOf: [
					{
						"$ref": "#/components/hiddenSchemas/version"
					},
					{
						type: "object",
						properties: {
							id_monitor: {
								type: "integer",
								description: "The monitor ID linked with this version"
							}
						}
					}
				]
			}
    },
    responses: {
      error: {
        description: "Error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: {
                  type: "boolean",
                },
                error: {
                  type: "string",
                },
              },
              example: {
                success: false,
                error: "Returned error",
              }
            }
          }
        }
      }
    }
  },
  paths: {
    "/api/monitors": {
      get: {
        summary: "Get all monitors",
        parameters: [],
        responses: {
          "200": {
            description: "All monitors obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    got: {
											type: "array",
											items: {
												"$ref": "#/components/hiddenSchemas/monitor",
											}
                    }
                  }
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
        },
        tags: ["monitors"],
      },
      post: {
        summary: "Create monitor",
        requestBody: {
          description: "Object to define a monitor",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                  },
                  url: {
                    type: "string",
                  },
                  selector: {
                    type: "string",
                  },
                  regex: {
                    type: "string"
                  },
                  image: {
                    type: "string",
                  }
                },
                required: ["name", "url", "selector"],
                example: {
                  name: "MonitorName",
                  url: "http://your.app-url.here/maybe/with/path?or=arguments",
                  selector: "CSS selector",
                  regex: "Regular expression",
                  image: "Logo url (if null get favicon of URL)",
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Created monitor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    posted: {
											"$ref": "#/components/hiddenSchemas/monitor"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
        },
        tags: ["monitors"],
      },
    },
    "/api/monitors/{id}": {
      get: {
        summary: "Get monitor by ID",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
				],
        responses: {
          "200": {
            description: "Monitor obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    got: {
											"$ref": "#/components/hiddenSchemas/monitor",
                    },
                  },
                },
              },
            },
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
        },
        tags: ["monitors"],
      },
      patch: {
        summary: "Change the properties of the monitor",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
				],
				requestBody: {
          description: "Changing monitor properties, no need to enter all the properties of the monitor",
          required: true,
					content: {
						"application/json": {
              schema: {
                type: "object",
								properties: {
									name: {
                    type: "string",
                  },
                  url: {
                    type: "string",
                  },
                  selector: {
                    type: "string",
                  },
                  regex: {
                    type: "string"
                  },
                  image: {
                    type: "string",
                  }
								}
							}
						}
					}
				},
        responses: {
          "200": {
            description: "Modified Monitor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    updated: {
											"$ref": "#/components/hiddenSchemas/monitor",
                    },
                  },
                },
              },
            },
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
        },
        tags: ["monitors"],
      },
      delete: {
        summary: "Delete the monitor",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Deleted Monitor",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    deleted: {
											"$ref": "#/components/hiddenSchemas/monitorAlone",
                    },
                  },
                },
              },
            },
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
        },
        tags: ["monitors"],
      },
		},
		"/api/monitors/{id}/check": {
      post: {
        summary: "Check new version for monitor with given ID",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
				],
        responses: {
          "200": {
            description: "Refresh monitor obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    got: {
											"$ref": "#/components/hiddenSchemas/monitor",
                    },
                  },
                },
              },
            },
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
        },
        tags: ["monitors"],
      },
		},
		"/api/monitors/{monitor_id}/headers": {
			post: {
        summary: "Create a header and link it to the monitor",
        parameters: [
					{
            name: "monitor_id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          }
				],
				requestBody: {
          description: "Properties of header",
          required: true,
					content: {
						"application/json": {
              schema: {
                type: "object",
								properties: {
									title: {
                    type: "string",
                  },
                  value: {
                    type: "string",
                  }
								},
								required: [
									"title",
									"value"
								]
							}
						}
					}
				},
        responses: {
          "200": {
            description: "Created header",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                    posted: {
											"$ref": "#/components/hiddenSchemas/header",
                    },
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
					"400": {
						description: "Error with monitor ID",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
										},
										error: {
											type: "string",
										},
									},
									example: {
										success: false,
										error: "Returned error",
									}
								}
							}
						}
					}
        },
        tags: ["monitors"],
      },
		},
		"/api/monitors/{monitor_id}/headers/{header_id}": {
			post: {
        summary: "Link the header to the monitor",
        parameters: [
					{
            name: "monitor_id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
					},
					{
						name: "header_id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
					}
				],
        responses: {
          "200": {
            description: "Link successfully completed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          },
					"400": {
						description: "Error with given IDs",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
										},
										error: {
											type: "string",
										},
									},
									example: {
										success: false,
										error: "Returned error",
									}
								}
							}
						}
					}
        },
        tags: ["monitors"],
			},
			delete: {
        summary: "Unlink the header to the monitor",
        parameters: [
					{
            name: "monitor_id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
					},
					{
						name: "header_id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
					}
				],
        responses: {
          "200": {
            description: "Unlink successfully completed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
					},
					"400": {
						description: "Error with given IDs",
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: {
										success: {
											type: "boolean",
										},
										error: {
											type: "string",
										},
									},
									example: {
										success: false,
										error: "Returned error",
									}
								}
							}
						}
					}
        },
        tags: ["monitors"],
      }
		},
    "/api/headers": {
      get: {
        summary: "Get all headers",
        parameters: [],
        responses: {
          "200": {
            description: "All headers obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										got: {
											type: "array",
											items: {
												"$ref": "#/components/hiddenSchemas/header",
											}
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["headers"],
      },
      post: {
        summary: "Create header",
				parameters: [],
				requestBody: {
          description: "Properties of header",
          required: true,
					content: {
						"application/json": {
              schema: {
                type: "object",
								properties: {
									title: {
                    type: "string",
                  },
                  value: {
                    type: "string",
                  }
								},
								required: [
									"title",
									"value"
								]
							}
						}
					}
				},
        responses: {
          "200": {
            description: "Created header",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										posted: {
											"$ref": "#/components/hiddenSchemas/header",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
					}
        },
        tags: ["headers"],
      },
    },
    "/api/headers/{id}": {
      get: {
        summary: "Get header by ID",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Obtained header",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										got: {
											"$ref": "#/components/hiddenSchemas/header",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["headers"],
      },
      patch: {
        summary: "Change the properties of the header",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
				],
				requestBody: {
          description: "Changing header properties",
          required: true,
					content: {
						"application/json": {
              schema: {
                type: "object",
								properties: {
									title: {
                    type: "string",
                  },
                  value: {
                    type: "string",
                  }
								},
								required: [
									"title",
									"value"
								] 
							}
						}
					}
				},
        responses: {
          "200": {
            description: "Modified header",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										updated: {
											"$ref": "#/components/hiddenSchemas/header",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["headers"],
      },
      delete: {
				summary: "Delete header",
				description: "Delete header and unlink all the monitors that were connected to it",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Deleted header",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										deleted: {
											"$ref": "#/components/hiddenSchemas/header",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["headers"],
      },
    },
    "/api/headers/fromMonitor/{id}": {
      get: {
				summary: "Get all headers linked to the monitor",
				description: "Get all headers from monitor by given id",
        parameters: [
          {
						name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Obtained headers",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										got: {
											type: "array",
											items: {
												"$ref": "#/components/hiddenSchemas/header",
											}
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["headers"],
      },
		},
		"/api/headers/toMonitors/{id}": {
      get: {
				summary: "Get all monitors linked to the header",
				description: "Get all monitors linked to the header by given id",
        parameters: [
          {
						name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Obtained monitors",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										got: {
											type: "array",
											items: {
												"$ref": "#/components/hiddenSchemas/monitor",
											}
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["headers"],
      },
    },
    "/api/versions": {
      get: {
        summary: "Get all versions",
        parameters: [],
        responses: {
          "200": {
            description: "All versions obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										got: {
											type: "array",
											items: {
												"$ref": "#/components/hiddenSchemas/versionAlone",
											}
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["versions"],
      },
      post: {
        summary: "Create version",
				parameters: [],
				requestBody: {
          description: "Properties of version",
          required: true,
					content: {
						"application/json": {
              schema: {
                type: "object",
								properties: {
									monitor_id: {
                    type: "integer",
                  },
                  value: {
                    type: "string",
									},
									discovery_timestamp: {
                    type: "string",
                  }
								},
								required: [
									"monitor_id",
									"value",
									"discovery_timestamp"
								]
							}
						}
					}
				},
        responses: {
          "200": {
            description: "Created version",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										posted: {
											"$ref": "#/components/hiddenSchemas/versionAlone",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["versions"],
      },
    },
    "/api/versions/{id}": {
      get: {
        summary: "Get version by ID",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Obtained version",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										got: {
											"$ref": "#/components/hiddenSchemas/versionAlone",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["versions"],
      },
      patch: {
        summary: "Change the properties of the version",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        requestBody: {
          description: "Properties of version",
          required: true,
					content: {
						"application/json": {
              schema: {
                type: "object",
								properties: {
                  value: {
                    type: "string",
									},
									discovery_timestamp: {
                    type: "string",
                  }
								},
								required: [
									"value",
									"discovery_timestamp"
								]
							}
						}
					}
				},
        responses: {
          "200": {
            description: "Modified version",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										updated: {
											"$ref": "#/components/hiddenSchemas/versionAlone",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["versions"],
      },
      delete: {
        summary: "Delete version",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Deleted version",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										deleted: {
											"$ref": "#/components/hiddenSchemas/versionAlone",
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["versions"],
      },
    },
    "/api/versions/fromMonitor/{id}": {
      get: {
        summary: "Get all versions linked to the monitor",
				description: "Get all versions from monitor by given id",
        parameters: [
          {
            name: "id",
            in: "path",
						required: true,
						schema: {
              type: "integer"
            }
          },
        ],
        responses: {
          "200": {
            description: "Obtained versions",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
										},
										got: {
											type: "array",
											items: {
												"$ref": "#/components/hiddenSchemas/version",
											}
                    }
									}
                }
              }
            }
          },
          "500": {
            "$ref": "#/components/responses/error",
          }
        },
        tags: ["versions"],
      },
    },
  },
};
