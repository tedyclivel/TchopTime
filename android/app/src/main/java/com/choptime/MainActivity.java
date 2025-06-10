package com.choptime;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.PackageList;
import com.facebook.react.ReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.bamtech.rnimagerecognizer.ImageRecognizerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setTheme(R.style.Theme_AppCompat_Light_NoActionBar);
  }

  @Override
  protected String getMainComponentName() {
    return "ChopTime";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new ReactRootView(getApplicationContext());
      }
    };
  }

  @Override
  protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new ImagePickerPackage());
    packages.add(new ImageRecognizerPackage());
    packages.add(new NetInfoPackage());
    packages.add(new AsyncStoragePackage());
    return packages;
  }
}
