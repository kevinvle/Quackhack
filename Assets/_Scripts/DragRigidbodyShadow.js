var spring = 50.0;
var damper = 5.0;
var drag = 10.0;
var angularDrag = 5.0;
var distance = 0.2;
var pushForce = 0.2;
var attachToCenterOfMass = false;

var highlightMaterial : Material;
private var highlightObject : GameObject;

private var springJoint : SpringJoint;

function Update()
{
	var mainCamera = FindCamera();
	
	highlightObject = null;
	if( springJoint != null && springJoint.connectedBody != null )
	{
		highlightObject = springJoint.connectedBody.gameObject;
	}
	else
	{
		// We need to actually hit an object
		var hitt : RaycastHit;
		if( Physics.Raycast(mainCamera.ScreenPointToRay(Input.mousePosition),  hitt, 100 ) ) {
			if( hitt.rigidbody && !hitt.rigidbody.isKinematic ) {
				highlightObject = hitt.rigidbody.gameObject;
			}
		}
	}
	
		
	// Make sure the user pressed the mouse down
	if (!Input.GetMouseButtonDown (0))
		return;

		
	// We need to actually hit an object
	var hit : RaycastHit;
	if (!Physics.Raycast(mainCamera.ScreenPointToRay(Input.mousePosition),  hit, 100)) {
		return;
	}
	// We need to hit a rigidbody that is not kinematic
	if (!hit.rigidbody || hit.rigidbody.isKinematic) {
		return;
	}
	
	if (!springJoint)
	{
		var go = new GameObject("Rigidbody dragger");
		body = go.AddComponent.<Rigidbody>();
		springJoint = go.AddComponent.<SpringJoint>();
		body.isKinematic = true;
	}
	
	springJoint.transform.position = hit.point;
	if (attachToCenterOfMass)
	{
		var anchor = transform.TransformDirection(hit.rigidbody.centerOfMass) + hit.rigidbody.transform.position;
		anchor = springJoint.transform.InverseTransformPoint(anchor);
		springJoint.anchor = anchor;
	}
	else
	{
		springJoint.anchor = Vector3.zero;
	}
	
	springJoint.spring = spring;
	springJoint.damper = damper;
	springJoint.maxDistance = distance;
	springJoint.connectedBody = hit.rigidbody;
	
	DragObject(hit.distance, hit.point, mainCamera.ScreenPointToRay(Input.mousePosition).direction);
}

function DragObject (distance : float, hitpoint : Vector3, dir : Vector3)
{
	var startTime = Time.time;
	var mousePos = Input.mousePosition;
	
	
	var oldDrag = springJoint.connectedBody.drag;
	var oldAngularDrag = springJoint.connectedBody.angularDrag;
	springJoint.connectedBody.drag = drag;
	springJoint.connectedBody.angularDrag = angularDrag;
	var mainCamera = FindCamera();
	while (Input.GetMouseButton (0))
	{
		var ray = mainCamera.ScreenPointToRay (Input.mousePosition);
		springJoint.transform.position = ray.GetPoint(distance);
		yield;
	}
	
	if (Mathf.Abs(mousePos.x - Input.mousePosition.x) <= 2 && Mathf.Abs(mousePos.y - Input.mousePosition.y) <= 2 && Time.time - startTime < .2 && springJoint.connectedBody)
	{
		dir.y = 0;
		dir.Normalize();
		springJoint.connectedBody.AddForceAtPosition(dir * pushForce, hitpoint, ForceMode.VelocityChange);
		ToggleLight( springJoint.connectedBody.gameObject );
	}	
	
	
	if (springJoint.connectedBody)
	{
		springJoint.connectedBody.drag = oldDrag;
		springJoint.connectedBody.angularDrag = oldAngularDrag;
		springJoint.connectedBody = null;
	}
}

static function ToggleLight( go : GameObject )
{		
	var theLight : Light = go.GetComponentInChildren(Light);
	if( !theLight )
		return;
		
	theLight.enabled = !theLight.enabled;
	var illumOn = theLight.enabled;
	var renderers = go.GetComponentsInChildren(MeshRenderer);
	for( var r : MeshRenderer in renderers )
	{
		if( r.gameObject.layer == 1 )
		{
			r.material.shader = Shader.Find(illumOn ? "Self-Illumin/Diffuse" : "Diffuse");
		}
	}
}

function FindCamera ()
{
	if (GetComponent.<Camera>())
		return GetComponent.<Camera>();
	else
		return Camera.main;
}

function OnPostRender()
{
	if( highlightObject == null )
		return;
		
	var go = highlightObject;
	highlightMaterial.SetPass( 0 );
	var meshes = go.GetComponentsInChildren(MeshFilter);
	for( var m : MeshFilter in meshes )
	{
		Graphics.DrawMeshNow( m.sharedMesh, m.transform.position, m.transform.rotation );
	}
}
