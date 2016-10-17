using UnityEngine;
using System.Collections;

public class tixScript : MonoBehaviour {


	void Start () {
		GetComponent<Renderer> ().enabled = false;
	}

	void Update () {
		if (Input.GetMouseButtonDown (2)) {
			GetComponent<Renderer> ().enabled = true;
		}
	}
}
