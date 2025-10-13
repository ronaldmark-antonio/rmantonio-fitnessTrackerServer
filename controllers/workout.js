const Workout = require("../models/Workout");

module.exports.addWorkout = (req,res) => {

	let newWorkout = new Workout({
		userId : req.user.id,
		name : req.body.name,
		duration : req.body.duration
	});

	newWorkout.save()
	.then(savedWorkout => res.status(201).send(savedWorkout))
	.catch(saveErr => {

		console.error("Error in saving the workout: ", saveErr)
		return res.status(500).send({ error: 'Failed to save the workout' });
	})

};

module.exports.getMyWorkouts = (req, res) => {

	Workout.find({ userId: req.user.id })
	.then(workouts => {

	    if (workouts.length > 0){
	        return res.status(200).send({ workouts });
	    }
	    else {

	        return res.status(200).send({ message: 'No workouts found.' })
	    }

	}).catch(err => res.status(500).send({ error: 'Error finding workouts.' }));

};

module.exports.updateWorkout = (req, res)=>{

    let updatedWorkout = {
        name : req.body.name,
		duration : req.body.duration
    }

    return Workout.findByIdAndUpdate(req.params.workoutId, updatedWorkout, { new: true, runValidators: true })
    .then(workout => {
        if (workout) {
            res.status(200).send({
                message: "Workout updated successfully",
                updatedWorkout: workout
            });
        } else {
            res.status(404).send({message: "Workout not found"});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {
    return Workout.findByIdAndDelete(req.params.workoutId)
    .then(workout => {
        if (workout) {
            res.status(200).send({
                message: "Workout deleted successfully"
            });
        } else {
            res.status(404).send({ message: "Workout not found" });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.completeWorkoutStatus = (req, res) => {
    let updateStatusField = {
        status: 'completed'
    };

    Workout.findById(req.params.workoutId)
    .then(workout => {
        if (!workout) {
            return res.status(404).send({ message: 'workout not found' });
        }

        if (workout.status === 'completed') {
            return res.status(200).send({
                message: "Workout already completed",
                workout: workout
            });
        }

        return Workout.findByIdAndUpdate(req.params.workoutId, updateStatusField, { new: true })
            .then(result => {
                if ( result) {
                    return res.status(200).send({ 
                    	message: "Workout status updated successfully", 
                    	updatedWorkout: result
                   	});
                } else {
                    return res.status(400).send({ message: "Error Occured" });
                }
            });
    })
    .catch(error => errorHandler(error, req, res));
};