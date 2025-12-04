let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET) avec pagination
function getAssignments(req, res){
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    console.log("GET /api/assignments - page:", page, "limit:", limit);
    
    var aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(
        aggregateQuery,
        {
            page: page,
            limit: limit,
        },
        (err, assignments) => {
            if (err) {
                console.error("Erreur pagination:", err);
                res.send(err);
            } else {
                console.log("Envoi de", assignments.docs.length, "assignments sur un total de", assignments.totalDocs);
                res.send(assignments);
            }
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    
    // On retire le champ _id qui est immuable dans MongoDB
    const updateData = { ...req.body };
    delete updateData._id;
    
    Assignment.findOneAndUpdate({id: req.body.id}, updateData, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else if (!assignment) {
            res.status(404).json({message: 'Assignment not found'})
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findOneAndDelete({id: req.params.id}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else if (!assignment) {
            res.status(404).json({message: 'Assignment not found'});
        } else {
            res.json({message: `${assignment.nom} deleted`});
        }
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
