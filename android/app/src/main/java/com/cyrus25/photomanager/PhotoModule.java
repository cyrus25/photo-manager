package com.cyrus25.photomanager;

import android.content.ContentUris;
import android.media.Image;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;

import android.content.ContentResolver;
import android.database.Cursor;
import android.provider.MediaStore;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class PhotoModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    private static final String DISPLAY_NAME = "DISPLAY_NAME";
    private static final String DATA = "DATA";
    private static final String DATE_TAKEN = "DATE_TAKEN";
    private static final String SIZE_IN_BYTES = "SIZE_IN_BYTES";


    PhotoModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "PhotoModule";
    }

    @ReactMethod
    public void getPhotos(String name1, final Callback errorCallback, final Callback successCallback) {
        executor.execute(() -> {
            try {
                WritableArray imagesArray = new WritableNativeArray();
                ArrayList<Image> imageList = new ArrayList<Image>();
                ContentResolver contentResolver = reactContext.getContentResolver();
                Uri uri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                String[] projection = new String[]{
                        MediaStore.Images.Media._ID,
                        MediaStore.Images.Media.DATA,
                        MediaStore.Images.Media.DATE_TAKEN,
                        MediaStore.Images.Media.MIME_TYPE,
                        MediaStore.Images.Media.SIZE,
                        MediaStore.Images.Media.DISPLAY_NAME,
                };
                Log.d("PhotoModule", "before cursor");
                String sortOrder = MediaStore.Images.Media.DATE_TAKEN + " DESC";
                Cursor cursor = contentResolver.query(uri, projection, null, null, sortOrder);
                int idColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID);
                int nameColumn =
                        cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DISPLAY_NAME);
                int sizeColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.SIZE);
                int dateColumn = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATE_TAKEN);
                Log.d("PhotoModule", "event called" + nameColumn + "ff");
                while (cursor.moveToNext()) {
                    WritableMap map = Arguments.createMap();
                    long id = cursor.getLong(idColumn);
                    String name = cursor.getString(nameColumn);
                    String path = cursor.getString(cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA));
                    int size = cursor.getInt(sizeColumn);
                    String date = cursor.getString(dateColumn);

                    Uri contentUri = ContentUris.withAppendedId(
                            MediaStore.Images.Media.EXTERNAL_CONTENT_URI, id);
                    Log.d("PhotoModule", "photo" + "p" + path);

                    // Stores column values and the contentUri in a local object
                    // that represents the media file.
                    //imageList.add(new Image(contentUri, name, duration, size));
                    map.putString(DISPLAY_NAME, name);
                    //map.putString(DATA, path);
                    map.putString(DATA, contentUri.toString());
                    map.putString(DATE_TAKEN, date);
                    map.putInt(SIZE_IN_BYTES, size);
                    imagesArray.pushMap(map);
                }
                new Handler(Looper.getMainLooper()).post(() -> {
                    successCallback.invoke(imagesArray);
                });

            } catch (Exception e) {
                Log.d("PhotoModule", "Error" + e.getMessage());
                new Handler(Looper.getMainLooper()).post(() -> {
                    errorCallback.invoke(e.getMessage());
                });
            }
        });
    }

}
