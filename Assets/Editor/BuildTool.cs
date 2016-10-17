using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Reflection;

public class BuildTool
{
	static string[] levels = new string[] { "Assets/Apartment Scene.unity" };

	[MenuItem("Build Tools/Select Platform/WinPlayer")]
	static void SelectPlatform_WinPlayer()
	{
		EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTarget.StandaloneWindows);
	}
	
	[MenuItem("Build Tools/Select Platform/WinPlayer", true)]
	static bool ValidatePlatform_WinPlayer()
	{
		return EditorUserBuildSettings.activeBuildTarget != BuildTarget.StandaloneWindows;
	}
	
	private static void BuildPlayerImpl(string output, bool arch64 = false)
	{
		BuildTarget target = EditorUserBuildSettings.activeBuildTarget;
		SelectPlatform_WinPlayer();
		UnityEditor.BuildOptions options = BuildOptions.None;
    	BuildPipeline.BuildPlayer(levels, output, arch64?BuildTarget.StandaloneWindows64:BuildTarget.StandaloneWindows, options);
		EditorUserBuildSettings.SwitchActiveBuildTarget(target);
	}
	
	[MenuItem("Build Tools/Build/Build Mechdyne Cluster 32bit Player")]
    static void BuildMechdyneClusterPlayer()
	{
		BuildPlayerImpl("Build/Room_of_Shadows/Room_of_Shadows.exe");
	}

	[MenuItem("Build Tools/Build/Build Mechdyne Cluster 64bit Player")]
	static void BuildMechdyneClusterPlayer64()
	{
		BuildPlayerImpl("Build/Room_of_Shadows_x64/Room_of_Shadows_x64.exe", true);
	}
	 
}
