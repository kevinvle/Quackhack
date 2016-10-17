using UnityEngine;
using System.Collections;

public class Screenoon : MonoBehaviour {

	public MovieTexture movTexture;
	private bool started;
	private int counter;

	void Start () {
		GetComponent <Renderer>().material.mainTexture = movTexture;
		AudioSource audio = GetComponent <AudioSource>();
		GetComponent<AudioSource>().Play();
		movTexture.loop = true;
		GetComponent<Renderer> ().enabled = false;
		counter = 0;
	}
		
	void Update () {
		if (Input.GetMouseButtonDown (0)) {
			counter++;
		}

		if (counter == 2) {
			if (this.transform.name == "leftScreen") {
				startDisThang ();
			}
			if (this.transform.name == "rightScreen") {
				startDisThang ();
			}
		} else if (counter == 1) {
			if (this.transform.name == "midScreen") {
				startDisThang ();
			}
		} else if (counter == 3) {
			if (this.transform.name == "topScreen") {
				startDisThang ();
			}
			if (this.transform.name == "leftScreen" || this.transform.name == "rightScreen") {
				stopDisThang ();
			}
			counter++;
		}
		if (Input.GetMouseButtonDown (1)) {
			counter = 0;
			stopDisThang ();
		}
	}

	void startDisThang(){		
		movTexture.Play();
		GetComponent<Renderer> ().enabled = true;
	}
	void stopDisThang(){
		movTexture.Stop ();
		GetComponent<Renderer> ().enabled = false;
	}
}