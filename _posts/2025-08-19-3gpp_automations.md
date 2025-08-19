---
title: "3GPP automations"
date: 2025-08-19
categories: [3GPP]
tags: [PC, windows]
layout: single
author_profile: true
toc: true
toc_sticky: true
mathjax: true 
---

## Excel Macros
### Point the links in tdoc excel to local

* Choose a base folder.
* Macro scans all files in all subfolders once and keeps them in memory.
* For each hyperlink in column A:
    * Takes the cell text (R4-2501234).
    * Finds the first file containing that string (case-insensitive).
        * Cell is a hyperlink → try to replace it (green/clear if found, red if not).
        * Cell has plain text but matches a file → convert to hyperlink (highlight differently, e.g., light blue).
        * Cell has plain text but no matching file → highlight another color (e.g., light orange).
* Print summary

```vb
Option Explicit

Dim allFiles As Collection

' Collect all files recursively into allFiles collection
Sub CollectFilesRecursive(ByVal baseFolder As String)
    Dim fso As Object, folder As Object, subfolder As Object, file As Object
    Set fso = CreateObject("Scripting.FileSystemObject")
    Set folder = fso.GetFolder(baseFolder)
    
    ' Add files
    For Each file In folder.Files
        allFiles.Add file.Path
    Next file
    
    ' Recurse into subfolders
    For Each subfolder In folder.SubFolders
        CollectFilesRecursive subfolder.Path
    Next subfolder
End Sub

Sub ReplaceHyperlinksWithLocalFiles_PartialMatch()
    Dim baseFolder As String
    Dim fd As FileDialog
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim cell As Range
    Dim filePath As String
    Dim f As Variant
    
    Dim updatedCount As Long
    Dim newHyperlinkCount As Long
    Dim notFoundCount As Long
    Dim notFoundList As String
    
    ' Pick base folder
    Set fd = Application.FileDialog(msoFileDialogFolderPicker)
    fd.Title = "Select Base Folder"
    If fd.Show <> -1 Then
        MsgBox "No folder selected. Exiting."
        Exit Sub
    End If
    baseFolder = fd.SelectedItems(1)
    
    ' Collect all files under base folder
    Set allFiles = New Collection
    CollectFilesRecursive baseFolder
    
    Set ws = ActiveSheet
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    ' Loop through column A
    For Each cell In ws.Range("A1:A" & lastRow)
        Dim searchKey As String
        searchKey = Trim(cell.Value)
        filePath = ""
        
        If searchKey <> "" Then
            ' Look for file containing the searchKey
            For Each f In allFiles
                If InStr(1, LCase(f), LCase(searchKey)) > 0 Then
                    filePath = f
                    Exit For
                End If
            Next f
            
            If filePath <> "" Then
                ' Found a matching file
                If cell.Hyperlinks.Count > 0 Then
                    ' Replace existing hyperlink
                    cell.Hyperlinks.Delete
                    ws.Hyperlinks.Add Anchor:=cell, Address:=filePath, TextToDisplay:=cell.Value
                    updatedCount = updatedCount + 1
                Else
                    ' Add new hyperlink
                    ws.Hyperlinks.Add Anchor:=cell, Address:=filePath, TextToDisplay:=cell.Value
                    newHyperlinkCount = newHyperlinkCount + 1
                End If
                cell.Interior.Color = RGB(200, 255, 200)   ' Light green = found
            Else
                ' No matching file
                If cell.Hyperlinks.Count > 0 Then
                    cell.Interior.Color = RGB(255, 200, 200)  ' Light red = missing for hyperlink
                Else
                    cell.Interior.Color = RGB(255, 230, 150)  ' Light orange = missing for plain text
                End If
                notFoundCount = notFoundCount + 1
                notFoundList = notFoundList & vbCrLf & "- " & searchKey
            End If
        End If
    Next cell
    
    ' Show summary
    Dim summaryMsg As String
    summaryMsg = "Update complete!" & vbCrLf & vbCrLf & _
                 "Hyperlinks updated: " & updatedCount & vbCrLf & _
                 "New hyperlinks added: " & newHyperlinkCount & vbCrLf & _
                 "Not found: " & notFoundCount
    
    If notFoundCount > 0 Then
        summaryMsg = summaryMsg & vbCrLf & vbCrLf & "Missing files:" & notFoundList
    End If
    
    MsgBox summaryMsg, vbInformation, "Hyperlink Update Summary"
End Sub

```