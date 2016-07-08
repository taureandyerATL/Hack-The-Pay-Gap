{
    "name": "JobDescriptionAnalysis",
    "base": "BaseModel",
    "options": {
        "validateUpsert": true
    },
    "properties": {
        "jobDescription": {
            "type": "string",
            "required": "true"
        },
        "draftSource": {
            "type": "string",
            "required": "true"
        },
        "marketSource": {
            "type": "array"
        },
        "draftId": {
            "type": "string"
        },
        "textioDocId": {
            "type": "string"
        },
        "textioSessionId": {
            "type": "string"
        },
        "textioWeaknesses": {
            "type": "string"
        },
        "textioStrenghts": {
            "type": "string"
        },
        "jobPostSourceId": {
            "type": "string"
        },
        "draftSourceUserId": {
            "type": "string"
        },
        "draftSourceUser": {
            "type": "string"
        },
        "posted": {
            "type": "boolean"
        }
    },
    "validations": [],
    "relations": {},
    "acls": [],
    "methods": []
}