//
// MainPage.xaml.cpp
// MainPage クラスの実装。
//

#include "pch.h"
#include "MainPage.xaml.h"

using namespace ImageView;

#include <ppltasks.h>
using namespace concurrency;
using namespace Platform;
using namespace Windows::Foundation;
using namespace Windows::Foundation::Collections;
using namespace Windows::UI::Xaml;
using namespace Windows::UI::Xaml::Controls;
using namespace Windows::UI::Xaml::Controls::Primitives;
using namespace Windows::UI::Xaml::Data;
using namespace Windows::UI::Xaml::Input;
using namespace Windows::UI::Xaml::Media;
using namespace Windows::UI::Xaml::Navigation;
using namespace Windows::Storage;
using namespace Windows::Storage::Pickers;

// 空白ページのアイテム テンプレートについては、http://go.microsoft.com/fwlink/?LinkId=234238 を参照してください

MainPage::MainPage()
{
	InitializeComponent();
}

/// <summary>
/// このページがフレームに表示されるときに呼び出されます。
/// </summary>
/// <param name="e">このページにどのように到達したかを説明するイベント データ。Parameter 
/// プロパティは、通常、ページを構成するために使用します。</param>
void MainPage::OnNavigatedTo(NavigationEventArgs^ e)
{
	(void) e;	// 未使用のパラメーター

	 FolderPicker^ folderPicker = ref new FolderPicker();
        folderPicker->SuggestedStartLocation = PickerLocationId::Desktop;

        // Users expect to have a filtered view of their folders depending on the scenario.
        // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
        folderPicker->FileTypeFilter->Append(".jpg");

        create_task(folderPicker->PickSingleFolderAsync()).then([this](StorageFolder^ folder)
        {
            if (folder)
            {
                OutputTextBlock->Text = "Picked folder: " + folder->Name;
            }
            else
            {
                OutputTextBlock->Text = "Operation cancelled.";
            }
        });
		
}
