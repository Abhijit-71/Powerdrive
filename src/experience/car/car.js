import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export class Car {
  constructor(model, physics) {
    const geometry = new THREE.BoxGeometry(2, 1, 4);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = model.getObjectByName("chasis");
    //console.log(model.rotation)
    mesh.castShadow = true;
    //scene.add(mesh);
    this.mesh = mesh;
    this.physics = physics;

    this.physics.addMesh(mesh, 10, 0.8); // addMesh places the RigidBody in the mesh.userData.physics object
    this.chassis = mesh.userData.physics.body;

    this.vehicleController = this.physics.world.createVehicleController(
      this.chassis,
    );

    this.wheels = [];

    this.addWheel(
      0,
      { x: 0, y: -0.05, z: 1.51 },
      mesh,
      model.getObjectByName("wheelFL"),
    );
    this.addWheel(
      1,
      { x: 0, y: -0.05, z: 0.02 },
      mesh,
      model.getObjectByName("wheelFR"),
    );
    this.addWheel(
      2,
      { x: 1.86, y: -0.05, z: 1.51 },
      mesh,
      model.getObjectByName("wheelBL"),
    );
    this.addWheel(
      3,
      { x: 1.86, y: -0.05, z: 0.02 },
      mesh,
      model.getObjectByName("wheelBR"),
    );

    this.vehicleController.setWheelSteering(0, Math.PI / 4);
    this.vehicleController.setWheelSteering(1, Math.PI / 4);

    this.movement = {
      forward: 0,
      right: 0,
      brake: 0,
      reset: false,
      accelerateForce: { value: 0, min: -30, max: 30, step: 1 },
      brakeForce: { value: 0, min: 0, max: 1, step: 0.05 },
    };

    window.addEventListener("keydown", (event) => {
      //console.log( event.key );
      if (event.key === "w" || event.key === "ArrowUp")
        this.movement.forward = -1;
      if (event.key === "s" || event.key === "ArrowDown")
        this.movement.forward = 1;
      if (event.key === "a" || event.key === "ArrowLeft")
        this.movement.right = 1;
      if (event.key === "d" || event.key === "ArrowRight")
        this.movement.right = -1;
      if (event.key === "r") this.movement.reset = true;
      if (event.key === " ") this.movement.brake = 1;
    });

    window.addEventListener("keyup", (event) => {
      if (
        event.key === "w" ||
        event.key === "s" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      )
        this.movement.forward = 0;
      if (
        event.key === "a" ||
        event.key === "d" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      )
        this.movement.right = 0;
      if (event.key === "r") this.movement.reset = false;
      if (event.key === " ") this.movement.brake = 0;
    });
  }

  addWheel(index, pos, carMesh, wheelMesh) {
    // Define wheel properties
    const wheelRadius = 0.4355;
    const wheelWidth = 0.4;
    const suspensionRestLength = 0.1;
    const wheelPosition = pos; // Position relative to chassis
    const wheelDirection = { x: 0.0, y: -1.0, z: 0.0 }; // Downward direction
    const wheelAxle = new THREE.Vector3(0, 0, 1); // Axle direction

    // Add the wheel to the vehicle controller
    this.vehicleController.addWheel(
      wheelPosition,
      wheelDirection,
      wheelAxle,
      suspensionRestLength,
      wheelRadius,
    );

    // Set suspension stiffness for wheel
    this.vehicleController.setWheelSuspensionStiffness(index, 24.0);

    // Set wheel friction
    this.vehicleController.setWheelFrictionSlip(index, 1000.0);

    // Enable steering for the wheel
    //this.vehicleController.setWheelSteering(index, wheelPosition.z < 0);

    const wheel = wheelMesh;

    if (index === 2 || index === 0) {
      wheelMesh.rotation.y = Math.PI;
    }
    if (index === 1 || index === 3) {
      wheelMesh.rotation.y = Math.PI;
    }

    wheel.castShadow = true;

    wheel.position.copy(wheelPosition);
    wheel.userData.baseQuat = wheel.quaternion.clone();

    this.wheels.push(wheel);
    carMesh.add(wheel);
  }

  updateWheels() {
    if (this.vehicleController === undefined) return;

    const wheelSteeringQuat = new THREE.Quaternion();
    const wheelRotationQuat = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);

    //const chassisPosition = chassis.translation();

    this.wheels.forEach((wheel, index) => {
      const wheelAxleCs = this.vehicleController.wheelAxleCs(index);
      const connection =
        this.vehicleController.wheelChassisConnectionPointCs(index).y || 0;
      const suspension =
        this.vehicleController.wheelSuspensionLength(index) || 0;
      const steering = this.vehicleController.wheelSteering(index) || 0;
      const rotationRad = this.vehicleController.wheelRotation(index) || 0;

      wheel.position.y = connection - suspension;

      wheelSteeringQuat.setFromAxisAngle(up, steering);
      wheelRotationQuat.setFromAxisAngle(wheelAxleCs, -rotationRad);

      wheel.quaternion.copy(wheelSteeringQuat).multiply(wheelRotationQuat);
      wheel.quaternion
        .copy(wheel.userData.baseQuat)
        .multiply(wheelSteeringQuat)
        .multiply(wheelRotationQuat);
    });
  }

  updateCarControl() {
    if (this.movement.reset) {
      this.chassis.setTranslation(this.physics.RAPIER.Vector3(0, 1, 0), true);
      this.chassis.setRotation(
        this.physics.RAPIER.Quaternion(0, 0, 0, 1),
        true,
      );
      this.chassis.setLinvel(this.physics.RAPIER.Vector3(0, 0, 0), true);
      this.chassis.setAngvel(this.physics.RAPIER.Vector3(0, 0, 0), true);

      this.movement.accelerateForce.value = 0;
      this.movement.brakeForce.value = 0;

      return;
    }

    let accelerateForce = 0;

    if (this.movement.forward < 0) {
      //if (this.movement.accelerateForce.value === 0) chassis.wakeUp();
      accelerateForce =
        this.movement.accelerateForce.value -
        this.movement.accelerateForce.step;
      if (accelerateForce < this.movement.accelerateForce.min)
        accelerateForce = this.movement.accelerateForce.min;
    } else if (this.movement.forward > 0) {
      //if (this.movement.accelerateForce.value === 0) chassis.wakeUp();
      accelerateForce =
        this.movement.accelerateForce.value +
        this.movement.accelerateForce.step;

      if (accelerateForce > this.movement.accelerateForce.max)
        accelerateForce = this.movement.accelerateForce.max;
    } else {
      if (this.chassis.isSleeping()) this.chassis.wakeUp();
    }

    this.movement.accelerateForce.value = accelerateForce;

    //console.log(accelerateForce);

    let brakeForce = 0;

    if (this.movement.brake > 0) {
      brakeForce =
        this.movement.brakeForce.value + this.movement.brakeForce.step;
      if (brakeForce > this.movement.brakeForce.max)
        brakeForce = this.movement.brakeForce.max;
    }

    this.movement.brakeForce.value = brakeForce;

    const engineForce = accelerateForce;

    this.vehicleController.setWheelEngineForce(2, engineForce);
    this.vehicleController.setWheelEngineForce(3, engineForce);

    const currentSteering = this.vehicleController.wheelSteering(0);
    const steerDirection = this.movement.right;
    const steerAngle = Math.PI / 4;

    const steering = THREE.MathUtils.lerp(
      currentSteering,
      steerAngle * steerDirection,
      0.25,
    );

    this.vehicleController.setWheelSteering(0, steering);
    this.vehicleController.setWheelSteering(1, steering);

    const wheelBrake = this.movement.brake * brakeForce;
    this.vehicleController.setWheelBrake(0, wheelBrake);
    this.vehicleController.setWheelBrake(1, wheelBrake);
    this.vehicleController.setWheelBrake(2, wheelBrake);
    this.vehicleController.setWheelBrake(3, wheelBrake);
  }
}
